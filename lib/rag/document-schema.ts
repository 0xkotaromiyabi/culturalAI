/**
 * HUMANITIES DOCUMENT SCHEMA
 * 
 * Rich metadata schema for humanities documents.
 * Designed for Cultural-Linguistic Reasoning RAG.
 * 
 * Key Principle: Documents are INTERPRETIVE FRAMEWORKS, not facts.
 */

// ============================================
// DISCIPLINE TYPES
// ============================================

export type Discipline = 'linguistics' | 'literature' | 'cultural_studies';

export type LinguisticsSubfield =
    | 'pragmatics'
    | 'sociolinguistics'
    | 'discourse_analysis'
    | 'semantics'
    | 'syntax'
    | 'phonology'
    | 'morphology'
    | 'historical_linguistics'
    | 'psycholinguistics'
    | 'applied_linguistics';

export type LiteratureSubfield =
    | 'literary_criticism'
    | 'comparative_literature'
    | 'postcolonial_literature'
    | 'genre_studies'
    | 'narrative_theory'
    | 'symbolism'
    | 'stylistics'
    | 'reception_theory';

export type CulturalStudiesSubfield =
    | 'ethnography'
    | 'cultural_norms'
    | 'postcolonial_studies'
    | 'media_studies'
    | 'identity_studies'
    | 'diaspora_studies'
    | 'gender_studies'
    | 'power_relations';

export type Subfield = LinguisticsSubfield | LiteratureSubfield | CulturalStudiesSubfield;

// ============================================
// DOCUMENT SCHEMA
// ============================================

export interface HumanitiesDocument {
    /** Unique identifier */
    id: string;

    /** Main content - interpretive text, NOT raw source */
    text: string;

    /** Primary disciplines this document belongs to */
    discipline: Discipline[];

    /** Specific subfields within disciplines */
    subfield: Subfield[];

    /** Cultures referenced or analyzed */
    culture: string[];

    /** Social/situational contexts */
    context: string[];

    /** Historical era */
    era: 'classical' | 'modern' | 'contemporary';

    /** Epistemological stance */
    stance: 'descriptive' | 'prescriptive' | 'critical';

    /** Confidence level of the interpretation */
    confidence: 'high' | 'medium' | 'low';

    /** Type of source */
    source_type: 'journal' | 'book' | 'ethnography' | 'analysis' | 'few_shot';

    /** Source citation */
    source: string;

    /** Optional: Related concepts for better retrieval */
    related_concepts?: string[];

    /** Optional: Languages discussed */
    languages?: string[];

    /** Optional: Vector embedding (for semantic search) */
    embedding?: number[];
}

// ============================================
// VALIDATION
// ============================================

const VALID_DISCIPLINES: Discipline[] = ['linguistics', 'literature', 'cultural_studies'];
const VALID_ERAS = ['classical', 'modern', 'contemporary'];
const VALID_STANCES = ['descriptive', 'prescriptive', 'critical'];
const VALID_CONFIDENCES = ['high', 'medium', 'low'];
const VALID_SOURCE_TYPES = ['journal', 'book', 'ethnography', 'analysis', 'few_shot'];

export function validateHumanitiesDocument(doc: unknown): asserts doc is HumanitiesDocument {
    if (!doc || typeof doc !== 'object') {
        throw new Error('Document must be an object');
    }

    const d = doc as Record<string, unknown>;

    // Required string fields
    if (typeof d.id !== 'string' || d.id.length === 0) {
        throw new Error('Document must have a non-empty id');
    }
    if (typeof d.text !== 'string' || d.text.length === 0) {
        throw new Error('Document must have non-empty text');
    }
    if (typeof d.source !== 'string') {
        throw new Error('Document must have a source');
    }

    // Required array fields
    if (!Array.isArray(d.discipline) || d.discipline.length === 0) {
        throw new Error('Document must have at least one discipline');
    }
    for (const disc of d.discipline) {
        if (!VALID_DISCIPLINES.includes(disc as Discipline)) {
            throw new Error(`Invalid discipline: ${disc}`);
        }
    }

    if (!Array.isArray(d.subfield)) {
        throw new Error('Document must have subfield array');
    }
    if (!Array.isArray(d.culture)) {
        throw new Error('Document must have culture array');
    }
    if (!Array.isArray(d.context)) {
        throw new Error('Document must have context array');
    }

    // Required enum fields
    if (!VALID_ERAS.includes(d.era as string)) {
        throw new Error(`Invalid era: ${d.era}`);
    }
    if (!VALID_STANCES.includes(d.stance as string)) {
        throw new Error(`Invalid stance: ${d.stance}`);
    }
    if (!VALID_CONFIDENCES.includes(d.confidence as string)) {
        throw new Error(`Invalid confidence: ${d.confidence}`);
    }
    if (!VALID_SOURCE_TYPES.includes(d.source_type as string)) {
        throw new Error(`Invalid source_type: ${d.source_type}`);
    }
}

export function isValidHumanitiesDocument(doc: unknown): doc is HumanitiesDocument {
    try {
        validateHumanitiesDocument(doc);
        return true;
    } catch {
        return false;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create a new humanities document with defaults
 */
export function createDocument(
    partial: Partial<HumanitiesDocument> & Pick<HumanitiesDocument, 'id' | 'text' | 'discipline' | 'source'>
): HumanitiesDocument {
    return {
        subfield: [],
        culture: [],
        context: [],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'medium',
        source_type: 'analysis',
        ...partial,
    };
}

/**
 * Check if document matches a discipline filter
 */
export function matchesDiscipline(doc: HumanitiesDocument, disciplines: Discipline[]): boolean {
    return disciplines.some(d => doc.discipline.includes(d));
}

/**
 * Check if document matches a culture filter
 */
export function matchesCulture(doc: HumanitiesDocument, cultures: string[]): boolean {
    if (cultures.length === 0) return true;
    return cultures.some(c =>
        doc.culture.some(dc => dc.toLowerCase().includes(c.toLowerCase()))
    );
}

/**
 * Check if document matches a context filter
 */
export function matchesContext(doc: HumanitiesDocument, contexts: string[]): boolean {
    if (contexts.length === 0) return true;
    return contexts.some(c =>
        doc.context.some(dc => dc.toLowerCase().includes(c.toLowerCase()))
    );
}
