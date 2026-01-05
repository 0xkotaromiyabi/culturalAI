/**
 * HUMANITIES INTENT ANALYZER
 * 
 * Enhanced intent analysis for Cultural-Linguistic Reasoning.
 * Extracts discipline classification, interpretive frame, and cultural context.
 * 
 * Key Difference from General RAG:
 * - Classifies by academic discipline (linguistics, literature, cultural studies)
 * - Identifies interpretive frames rather than fact-seeking queries
 * - Detects cross-cultural comparison needs
 */

import { callLLM, parseLLMJson } from '../services/llm';
import type { Discipline, Subfield } from './document-schema';

// ============================================
// HUMANITIES INTENT INTERFACE
// ============================================

export interface HumanitiesIntent {
    // Cultural context
    cultures_involved: string[];
    potential_conflicts: string[];

    // Academic classification
    primary_discipline: Discipline;
    secondary_disciplines: Discipline[];
    subfields: Subfield[];

    // Query characteristics
    social_domain: string;
    key_concepts: string[];
    query_type: 'translation' | 'error_analysis' | 'cultural_explanation' | 'comparative' | 'interpretive' | 'general';

    // Humanities-specific
    interpretive_frame: string;
    requires_comparison: boolean;
    requires_historical_context: boolean;

    // Confidence in analysis
    analysis_confidence: 'high' | 'medium' | 'low';
}

// Legacy interface for backwards compatibility
export interface CulturalIntent {
    cultures_involved: string[];
    social_domain: string;
    potential_conflicts: string[];
    key_concepts: string[];
    query_type: 'translation' | 'error_analysis' | 'cultural_explanation' | 'general';
}

// ============================================
// INTENT ANALYSIS PROMPT
// ============================================

const HUMANITIES_INTENT_PROMPT = `
You are a humanities research assistant analyzing user queries for Cultural-Linguistic Reasoning.

Your task is to classify the query and extract structured metadata for knowledge retrieval.

DISCIPLINE CLASSIFICATION:
- "linguistics": Questions about language structure, pragmatics, sociolinguistics, discourse
- "literature": Questions about literary analysis, symbolism, narrative, genre
- "cultural_studies": Questions about cultural norms, ethnography, identity, power

SUBFIELD EXAMPLES:
- Linguistics: pragmatics, sociolinguistics, discourse_analysis, semantics
- Cultural Studies: ethnography, cultural_norms, postcolonial_studies, identity_studies
- Literature: literary_criticism, symbolism, postcolonial_literature

QUERY TYPE:
- "translation": Translating between languages
- "error_analysis": Analyzing language errors
- "cultural_explanation": Explaining cultural practices
- "comparative": Comparing across cultures  
- "interpretive": Seeking interpretation/analysis
- "general": General inquiry

Return ONLY valid JSON:
{
  "cultures_involved": ["culture1", "culture2"],
  "potential_conflicts": ["conflict description"],
  "primary_discipline": "linguistics|literature|cultural_studies",
  "secondary_disciplines": [],
  "subfields": ["pragmatics", "cultural_norms"],
  "social_domain": "domain name",
  "key_concepts": ["concept1", "concept2"],
  "query_type": "cultural_explanation",
  "interpretive_frame": "Brief description of interpretive angle",
  "requires_comparison": true/false,
  "requires_historical_context": true/false,
  "analysis_confidence": "high|medium|low"
}
`;

// ============================================
// INTENT ANALYSIS FUNCTION
// ============================================

/**
 * Analyze user query for humanities-focused retrieval
 */
export async function analyzeHumanitiesIntent(
    question: string,
    context?: string
): Promise<HumanitiesIntent> {
    const userPrompt = `
User Question: ${question}

${context ? `Additional Context: ${context}` : ''}

Analyze this query for humanities-focused knowledge retrieval.
Identify the academic discipline, cultural context, and interpretive needs.
`;

    try {
        const response = await callLLM({
            systemPrompt: HUMANITIES_INTENT_PROMPT,
            userPrompt,
            temperature: 0.3,
            responseFormat: 'json',
        });

        const intent = parseLLMJson<HumanitiesIntent>(response);

        // Validate required fields
        if (!intent.primary_discipline || !intent.cultures_involved) {
            throw new Error('Invalid intent structure');
        }

        return intent;
    } catch (error: unknown) {
        console.error('❌ Failed to analyze humanities intent:', error);

        // Return intelligent fallback
        return createFallbackIntent(question);
    }
}

/**
 * Create fallback intent with heuristic classification
 */
function createFallbackIntent(question: string): HumanitiesIntent {
    const questionLower = question.toLowerCase();

    // Heuristic discipline detection
    let primaryDiscipline: Discipline = 'linguistics';
    const subfields: Subfield[] = [];

    if (questionLower.includes('sastra') || questionLower.includes('novel') ||
        questionLower.includes('puisi') || questionLower.includes('literary')) {
        primaryDiscipline = 'literature';
        subfields.push('literary_criticism');
    } else if (questionLower.includes('budaya') || questionLower.includes('culture') ||
        questionLower.includes('tradisi') || questionLower.includes('norma')) {
        primaryDiscipline = 'cultural_studies';
        subfields.push('cultural_norms');
    } else if (questionLower.includes('sopan') || questionLower.includes('polite') ||
        questionLower.includes('formal') || questionLower.includes('bahasa')) {
        primaryDiscipline = 'linguistics';
        subfields.push('pragmatics', 'sociolinguistics');
    }

    // Heuristic culture detection
    const cultures: string[] = [];
    if (questionLower.includes('indonesia') || questionLower.includes('indonesian')) {
        cultures.push('Indonesia');
    }
    if (questionLower.includes('jawa') || questionLower.includes('javanese')) {
        cultures.push('Java');
    }
    if (questionLower.includes('english') || questionLower.includes('inggris')) {
        cultures.push('English');
    }
    if (questionLower.includes('china') || questionLower.includes('chinese') ||
        questionLower.includes('mandarin')) {
        cultures.push('Chinese');
    }
    if (questionLower.includes('jepang') || questionLower.includes('japan')) {
        cultures.push('Japanese');
    }
    if (questionLower.includes('barat') || questionLower.includes('western')) {
        cultures.push('Western');
    }

    if (cultures.length === 0) {
        cultures.push('General');
    }

    // Detect comparison needs
    const requiresComparison = cultures.length > 1 ||
        questionLower.includes('beda') ||
        questionLower.includes('differ') ||
        questionLower.includes('compare');

    return {
        cultures_involved: cultures,
        potential_conflicts: [],
        primary_discipline: primaryDiscipline,
        secondary_disciplines: [],
        subfields: subfields.length > 0 ? subfields : ['pragmatics'],
        social_domain: 'general communication',
        key_concepts: question.split(' ').filter(w => w.length > 4).slice(0, 5),
        query_type: requiresComparison ? 'comparative' : 'cultural_explanation',
        interpretive_frame: 'General cultural-linguistic analysis',
        requires_comparison: requiresComparison,
        requires_historical_context: false,
        analysis_confidence: 'low',
    };
}

// ============================================
// LEGACY COMPATIBILITY
// ============================================

/**
 * Legacy function for backwards compatibility
 */
export async function buildRagQuery(
    question: string,
    context?: string
): Promise<CulturalIntent> {
    const humanitiesIntent = await analyzeHumanitiesIntent(question, context);

    // Convert to legacy format
    return {
        cultures_involved: humanitiesIntent.cultures_involved,
        social_domain: humanitiesIntent.social_domain,
        potential_conflicts: humanitiesIntent.potential_conflicts,
        key_concepts: humanitiesIntent.key_concepts,
        query_type: humanitiesIntent.query_type === 'comparative' ||
            humanitiesIntent.query_type === 'interpretive'
            ? 'cultural_explanation'
            : humanitiesIntent.query_type,
    };
}

/**
 * Convert HumanitiesIntent to legacy CulturalIntent
 */
export function toLegacyIntent(intent: HumanitiesIntent): CulturalIntent {
    return {
        cultures_involved: intent.cultures_involved,
        social_domain: intent.social_domain,
        potential_conflicts: intent.potential_conflicts,
        key_concepts: intent.key_concepts,
        query_type: intent.query_type === 'comparative' || intent.query_type === 'interpretive'
            ? 'cultural_explanation'
            : intent.query_type,
    };
}
