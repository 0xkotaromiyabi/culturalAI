/**
 * HUMANITIES HYBRID RETRIEVER
 * 
 * Specialized retrieval for Cultural-Linguistic Reasoning.
 * 
 * Key Differences from General RAG:
 * 1. Metadata filtering by discipline, culture, context
 * 2. Discipline-aware ranking
 * 3. Confidence-based reranking
 * 4. Treats documents as interpretive frameworks, not facts
 */

import { HUMANITIES_KNOWLEDGE_BASE } from './knowledge-base';
import { type HumanitiesIntent, type CulturalIntent } from './query-builder';
import type { Discipline, HumanitiesDocument } from './document-schema';

// ============================================
// RETRIEVAL OPTIONS
// ============================================

export interface RetrievalOptions {
    maxResults: number;
    minConfidence?: 'high' | 'medium' | 'low';
    disciplines?: Discipline[];
    cultures?: string[];
    contexts?: string[];
    preferHighConfidence?: boolean;
    includeRelatedDisciplines?: boolean;
}

const DEFAULT_OPTIONS: RetrievalOptions = {
    maxResults: 5,
    minConfidence: 'low',
    preferHighConfidence: true,
    includeRelatedDisciplines: true,
};

// ============================================
// SCORING WEIGHTS
// ============================================

const SCORING_WEIGHTS = {
    disciplineMatch: 3.0,
    subfieldMatch: 2.5,
    cultureMatch: 2.0,
    contextMatch: 1.5,
    conceptMatch: 1.0,
    confidenceBonus: {
        high: 1.5,
        medium: 1.0,
        low: 0.5,
    },
    sourceTypeBonus: {
        journal: 1.3,
        book: 1.2,
        ethnography: 1.4,
        analysis: 1.0,
        few_shot: 0.8,
    },
};

// ============================================
// LEGACY INTERFACE (backwards compatibility)
// ============================================

export interface RetrievedDocument {
    id: string;
    text: string;
    cultures: string[];
    domain: string[];
    source_type: 'few-shot' | 'ethnography' | 'linguistics';
    confidence: 'high' | 'medium' | 'low';
    metadata?: Record<string, unknown>;
}

// ============================================
// HYBRID RETRIEVAL
// ============================================

/**
 * Main hybrid retrieval function
 * Combines: keyword matching + metadata filtering + discipline ranking
 */
export async function hybridRetrieve(
    query: string,
    intent: HumanitiesIntent,
    options: Partial<RetrievalOptions> = {}
): Promise<HumanitiesDocument[]> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    console.log('🔍 Hybrid Retrieval Start');
    console.log(`   Query: "${query.substring(0, 50)}..."`);
    console.log(`   Discipline: ${intent.primary_discipline}`);
    console.log(`   Cultures: ${intent.cultures_involved.join(', ')}`);

    // Step 1: Score all documents
    const scoredDocs = HUMANITIES_KNOWLEDGE_BASE.map(doc => ({
        doc,
        score: calculateRelevanceScore(doc, query, intent, opts),
    }));

    // Step 2: Filter by minimum confidence
    const filtered = scoredDocs.filter(({ doc, score }) => {
        if (score <= 0) return false;
        if (opts.minConfidence === 'high' && doc.confidence !== 'high') return false;
        if (opts.minConfidence === 'medium' && doc.confidence === 'low') return false;
        return true;
    });

    // Step 3: Sort by score (highest first)
    filtered.sort((a, b) => b.score - a.score);

    // Step 4: Apply discipline-aware diversification
    const diversified = diversifyResults(filtered, intent, opts.maxResults);

    console.log(`   Retrieved: ${diversified.length} documents`);

    return diversified.map(({ doc }) => doc);
}

/**
 * Calculate relevance score for a document
 */
function calculateRelevanceScore(
    doc: HumanitiesDocument,
    query: string,
    intent: HumanitiesIntent,
    opts: RetrievalOptions
): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    // 1. Discipline match
    if (doc.discipline.includes(intent.primary_discipline)) {
        score += SCORING_WEIGHTS.disciplineMatch;
    }
    if (opts.includeRelatedDisciplines) {
        for (const disc of intent.secondary_disciplines || []) {
            if (doc.discipline.includes(disc)) {
                score += SCORING_WEIGHTS.disciplineMatch * 0.5;
            }
        }
    }

    // 2. Subfield match
    for (const subfield of intent.subfields || []) {
        if (doc.subfield.includes(subfield as any)) {
            score += SCORING_WEIGHTS.subfieldMatch;
        }
    }

    // 3. Culture match
    for (const culture of intent.cultures_involved) {
        const cultureLower = culture.toLowerCase();
        if (doc.culture.some(c => c.toLowerCase().includes(cultureLower))) {
            score += SCORING_WEIGHTS.cultureMatch;
        }
    }

    // 4. Context match (if specified)
    if (opts.contexts && opts.contexts.length > 0) {
        for (const context of opts.contexts) {
            if (doc.context.includes(context)) {
                score += SCORING_WEIGHTS.contextMatch;
            }
        }
    }

    // 5. Keyword/concept match
    for (const concept of intent.key_concepts) {
        const conceptLower = concept.toLowerCase();
        if (doc.text.toLowerCase().includes(conceptLower)) {
            score += SCORING_WEIGHTS.conceptMatch;
        }
        if (doc.related_concepts?.some(rc => rc.toLowerCase().includes(conceptLower))) {
            score += SCORING_WEIGHTS.conceptMatch * 0.5;
        }
    }

    // 6. Query text match (semantic approximation)
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
    for (const word of queryWords) {
        if (doc.text.toLowerCase().includes(word)) {
            score += 0.3;
        }
    }

    // 7. Confidence bonus
    if (opts.preferHighConfidence) {
        score *= SCORING_WEIGHTS.confidenceBonus[doc.confidence];
    }

    // 8. Source type bonus
    score *= SCORING_WEIGHTS.sourceTypeBonus[doc.source_type];

    return score;
}

/**
 * Diversify results to avoid all documents from same discipline/culture
 */
function diversifyResults(
    scored: { doc: HumanitiesDocument; score: number }[],
    intent: HumanitiesIntent,
    maxResults: number
): { doc: HumanitiesDocument; score: number }[] {
    const result: { doc: HumanitiesDocument; score: number }[] = [];
    const disciplineCounts: Record<string, number> = {};
    const cultureCounts: Record<string, number> = {};

    const maxPerDiscipline = Math.ceil(maxResults / 2);
    const maxPerCulture = Math.ceil(maxResults / 2);

    for (const item of scored) {
        if (result.length >= maxResults) break;

        // Check discipline diversity
        const primaryDisc = item.doc.discipline[0];
        if ((disciplineCounts[primaryDisc] || 0) >= maxPerDiscipline) {
            continue;
        }

        // Check culture diversity (if comparison is needed)
        if (intent.requires_comparison) {
            const primaryCulture = item.doc.culture[0];
            if ((cultureCounts[primaryCulture] || 0) >= maxPerCulture) {
                continue;
            }
            cultureCounts[primaryCulture] = (cultureCounts[primaryCulture] || 0) + 1;
        }

        disciplineCounts[primaryDisc] = (disciplineCounts[primaryDisc] || 0) + 1;
        result.push(item);
    }

    // Fill remaining slots if needed
    if (result.length < maxResults) {
        for (const item of scored) {
            if (result.length >= maxResults) break;
            if (!result.includes(item)) {
                result.push(item);
            }
        }
    }

    return result;
}

// ============================================
// LEGACY COMPATIBILITY
// ============================================

/**
 * Legacy retrieval function for backwards compatibility
 */
export async function retrieveDocuments(
    intent: CulturalIntent,
    maxResults: number = 3
): Promise<RetrievedDocument[]> {
    // Convert legacy intent to humanities intent
    const humanitiesIntent: HumanitiesIntent = {
        cultures_involved: intent.cultures_involved,
        potential_conflicts: intent.potential_conflicts,
        primary_discipline: 'linguistics',
        secondary_disciplines: ['cultural_studies'],
        subfields: ['pragmatics'],
        social_domain: intent.social_domain,
        key_concepts: intent.key_concepts,
        query_type: intent.query_type,
        interpretive_frame: 'General analysis',
        requires_comparison: intent.cultures_involved.length > 1,
        requires_historical_context: false,
        analysis_confidence: 'medium',
    };

    const docs = await hybridRetrieve(
        intent.key_concepts.join(' '),
        humanitiesIntent,
        { maxResults }
    );

    // Convert to legacy format
    return docs.map(doc => ({
        id: doc.id,
        text: doc.text,
        cultures: doc.culture,
        domain: doc.discipline,
        source_type: mapSourceType(doc.source_type),
        confidence: doc.confidence,
        metadata: {
            subfields: doc.subfield,
            context: doc.context,
            era: doc.era,
            stance: doc.stance,
            source: doc.source,
        },
    }));
}

function mapSourceType(sourceType: string): 'few-shot' | 'ethnography' | 'linguistics' {
    if (sourceType === 'few_shot') return 'few-shot';
    if (sourceType === 'ethnography') return 'ethnography';
    return 'linguistics';
}

// ============================================
// SPECIALIZED RETRIEVERS
// ============================================

/**
 * Retrieve documents specifically for cross-cultural comparison
 */
export async function retrieveForComparison(
    cultures: string[],
    topic: string,
    maxPerCulture: number = 2
): Promise<HumanitiesDocument[]> {
    const results: HumanitiesDocument[] = [];

    for (const culture of cultures) {
        const docs = HUMANITIES_KNOWLEDGE_BASE
            .filter(doc => doc.culture.some(c =>
                c.toLowerCase().includes(culture.toLowerCase())
            ))
            .filter(doc => doc.text.toLowerCase().includes(topic.toLowerCase()))
            .slice(0, maxPerCulture);

        results.push(...docs);
    }

    return results;
}

/**
 * Retrieve documents by academic discipline
 */
export function retrieveByDiscipline(
    discipline: Discipline,
    maxResults: number = 5
): HumanitiesDocument[] {
    return HUMANITIES_KNOWLEDGE_BASE
        .filter(doc => doc.discipline.includes(discipline))
        .sort((a, b) => {
            // Prefer high confidence
            const confScore = { high: 3, medium: 2, low: 1 };
            return confScore[b.confidence] - confScore[a.confidence];
        })
        .slice(0, maxResults);
}
