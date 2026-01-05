/**
 * HUMANITIES KNOWLEDGE BASE
 * 
 * Seed data for Cultural-Linguistic Reasoning RAG.
 * Contains interpretive frameworks from:
 * - Linguistics (pragmatics, sociolinguistics, discourse)
 * - Cultural Studies (ethnography, cultural norms, power)
 * - Literature (criticism, symbolism, genre)
 * 
 * IMPORTANT: These are INTERPRETATIONS, not absolute facts.
 */

import { HumanitiesDocument, createDocument } from './document-schema';

// ============================================
// LINGUISTICS: PRAGMATICS
// ============================================

const PRAGMATICS_DOCS: HumanitiesDocument[] = [
    createDocument({
        id: 'prag-politeness-indo-01',
        text: 'In Indonesian academic contexts, indirectness functions as a politeness strategy to maintain hierarchical harmony. Direct requests are often perceived as face-threatening, particularly when directed at superiors. The use of hedging expressions like "mungkin" (perhaps) or "kalau boleh" (if I may) serves to soften illocutionary force while preserving the addressee\'s negative face.',
        discipline: ['linguistics', 'cultural_studies'],
        subfield: ['pragmatics', 'cultural_norms'],
        culture: ['Indonesia'],
        context: ['academic', 'formal'],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'high',
        source_type: 'journal',
        source: 'Journal of Pragmatics',
        related_concepts: ['politeness', 'indirectness', 'face-threatening acts', 'hedging'],
        languages: ['Indonesian', 'English'],
    }),
    createDocument({
        id: 'prag-silence-asian-01',
        text: 'Silence in East Asian communicative contexts carries distinct pragmatic functions that differ fundamentally from Western interpretations. In Japanese, Chinese, and Korean discourse, pauses and silence during conversation often signal respect, contemplation, or deference rather than discomfort or incomprehension. This reflects cultural values that prioritize collective harmony (wa in Japanese) over individual expression.',
        discipline: ['linguistics', 'cultural_studies'],
        subfield: ['pragmatics', 'cultural_norms'],
        culture: ['Japan', 'China', 'Korea', 'East Asia'],
        context: ['general', 'formal'],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'high',
        source_type: 'ethnography',
        source: 'Cross-Cultural Pragmatics',
        related_concepts: ['silence', 'pragmatics', 'respect', 'harmony', 'wa'],
        languages: ['Japanese', 'Chinese', 'Korean'],
    }),
    createDocument({
        id: 'prag-speech-acts-01',
        text: 'Speech act theory demonstrates that utterances perform actions beyond conveying information. In collectivist cultures, the illocutionary force of speech acts is often negotiated through context, relationship, and implicit understanding rather than explicit linguistic markers. What appears as a "question" may function as a request, and what seems like a "statement" may constitute an indirect refusal.',
        discipline: ['linguistics'],
        subfield: ['pragmatics', 'discourse_analysis'],
        culture: ['General', 'Collectivist'],
        context: ['general'],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'high',
        source_type: 'book',
        source: 'Austin, J.L. - How to Do Things with Words',
        related_concepts: ['speech acts', 'illocutionary force', 'indirect speech acts'],
        languages: ['General'],
    }),
    createDocument({
        id: 'prag-fta-indonesian-01',
        text: 'Face-threatening acts (FTAs) in Indonesian discourse are managed through elaborate politeness strategies. The concept of "sungkan" (social reluctance/deference) governs interactions where speakers avoid imposing on others. Refusals are typically indirect, often taking the form of acceptance with conditions that effectively constitute a polite decline.',
        discipline: ['linguistics', 'cultural_studies'],
        subfield: ['pragmatics', 'cultural_norms'],
        culture: ['Indonesia', 'Java'],
        context: ['social', 'formal'],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'high',
        source_type: 'journal',
        source: 'Indonesian Pragmatics Studies',
        related_concepts: ['face-threatening acts', 'sungkan', 'politeness', 'refusal strategies'],
        languages: ['Indonesian', 'Javanese'],
    }),
];

// ============================================
// LINGUISTICS: SOCIOLINGUISTICS
// ============================================

const SOCIOLINGUISTICS_DOCS: HumanitiesDocument[] = [
    createDocument({
        id: 'socio-register-indo-01',
        text: 'Register variation in Indonesian reflects social hierarchies and situational formality. The distinction between "aku/kamu" (informal) and "saya/Anda" (formal) pronouns indicates not merely politeness but social positioning. In Javanese-influenced Indonesian, the choice of register signals respect for age, status, and social distance, with inappropriate register selection potentially causing significant social offense.',
        discipline: ['linguistics'],
        subfield: ['sociolinguistics', 'pragmatics'],
        culture: ['Indonesia', 'Java'],
        context: ['general'],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'high',
        source_type: 'journal',
        source: 'Sociolinguistics in Southeast Asia',
        related_concepts: ['register', 'pronouns', 'formality', 'social hierarchy'],
        languages: ['Indonesian', 'Javanese'],
    }),
    createDocument({
        id: 'socio-codeswitching-01',
        text: 'Code-switching among multilingual speakers serves identity negotiation functions beyond mere linguistic convenience. In postcolonial contexts, switching between colonial languages (English, Dutch) and local languages signals educational background, social aspirations, and group membership. The choice to code-switch is often a strategic performance of hybrid identity.',
        discipline: ['linguistics', 'cultural_studies'],
        subfield: ['sociolinguistics', 'identity_studies'],
        culture: ['Postcolonial', 'Multilingual'],
        context: ['general'],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'high',
        source_type: 'book',
        source: 'Code-Switching in Postcolonial Contexts',
        related_concepts: ['code-switching', 'identity', 'multilingualism', 'postcolonial'],
        languages: ['General'],
    }),
    createDocument({
        id: 'socio-power-language-01',
        text: 'Language and power are inextricably linked in social interaction. The use of honorifics, formal registers, and deferential speech patterns reflects and reinforces power asymmetries. In hierarchical societies, the linguistic subordinate must employ elaborate politeness strategies while the socially superior speaker may use direct, unmarked forms. This asymmetry perpetuates social structures through everyday discourse.',
        discipline: ['linguistics', 'cultural_studies'],
        subfield: ['sociolinguistics', 'power_relations'],
        culture: ['General', 'Hierarchical'],
        context: ['general', 'institutional'],
        era: 'contemporary',
        stance: 'critical',
        confidence: 'high',
        source_type: 'book',
        source: 'Language and Power - Fairclough',
        related_concepts: ['power', 'honorifics', 'hierarchy', 'discourse'],
        languages: ['General'],
    }),
];

// ============================================
// CULTURAL STUDIES
// ============================================

const CULTURAL_STUDIES_DOCS: HumanitiesDocument[] = [
    createDocument({
        id: 'cult-collectivism-01',
        text: 'Collectivist cultural orientations fundamentally shape communicative expectations. In societies emphasizing group harmony over individual expression, direct confrontation is typically avoided, consensus-building is valued, and personal opinions are often framed as group perspectives. This orientation influences everything from turn-taking patterns to acceptable topics of discourse.',
        discipline: ['cultural_studies'],
        subfield: ['cultural_norms', 'ethnography'],
        culture: ['East Asia', 'Southeast Asia', 'Collectivist'],
        context: ['general'],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'high',
        source_type: 'ethnography',
        source: 'Hofstede Cultural Dimensions Research',
        related_concepts: ['collectivism', 'harmony', 'group identity', 'indirect communication'],
    }),
    createDocument({
        id: 'cult-personal-questions-indo-01',
        text: 'The asking of personal questions (about marriage, salary, age) in Indonesian and many Asian contexts functions as a social bonding ritual rather than an invasion of privacy. Questions like "Sudah menikah?" (Are you married?) signal care and social investment. This practice reflects communal identity orientation where personal status is considered community concern rather than private matter.',
        discipline: ['cultural_studies', 'linguistics'],
        subfield: ['cultural_norms', 'pragmatics'],
        culture: ['Indonesia', 'Asia'],
        context: ['social', 'casual'],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'high',
        source_type: 'ethnography',
        source: 'Indonesian Social Norms Studies',
        related_concepts: ['personal questions', 'social bonding', 'privacy', 'communal identity'],
        languages: ['Indonesian'],
    }),
    createDocument({
        id: 'cult-diaspora-identity-01',
        text: 'Diaspora communities navigate complex hybrid identities through language. Second-generation immigrants often experience linguistic insecurity in both heritage and dominant languages, leading to unique forms of cultural negotiation. Code-switching, heritage language maintenance, and accent modification become sites of identity performance and cultural belonging.',
        discipline: ['cultural_studies', 'linguistics'],
        subfield: ['diaspora_studies', 'identity_studies', 'sociolinguistics'],
        culture: ['Diaspora', 'Immigrant'],
        context: ['general'],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'medium',
        source_type: 'journal',
        source: 'Journal of Multilingual and Multicultural Development',
        related_concepts: ['diaspora', 'hybrid identity', 'heritage language', 'belonging'],
    }),
    createDocument({
        id: 'cult-postcolonial-language-01',
        text: 'Postcolonial language dynamics reveal ongoing tensions between colonial linguistic legacies and indigenous language revitalization. In many former colonies, the colonial language retains prestige in education and government while local languages are associated with authenticity and tradition. Speakers must navigate these competing symbolic meanings in daily linguistic choices.',
        discipline: ['cultural_studies', 'linguistics'],
        subfield: ['postcolonial_studies', 'sociolinguistics'],
        culture: ['Postcolonial', 'Indonesia', 'India', 'Africa'],
        context: ['general', 'institutional'],
        era: 'contemporary',
        stance: 'critical',
        confidence: 'high',
        source_type: 'book',
        source: 'Postcolonial Linguistics',
        related_concepts: ['postcolonialism', 'language prestige', 'linguistic imperialism'],
    }),
];

// ============================================
// LITERATURE / LITERARY ANALYSIS
// ============================================

const LITERATURE_DOCS: HumanitiesDocument[] = [
    createDocument({
        id: 'lit-symbolism-cultural-01',
        text: 'Literary symbols carry culturally specific meanings that resist direct translation. The lotus flower symbolizes purity in Buddhist contexts, while the cherry blossom represents ephemeral beauty in Japanese aesthetics. Literary analysis must account for these cultural symbolic systems rather than imposing universal interpretive frameworks.',
        discipline: ['literature', 'cultural_studies'],
        subfield: ['symbolism', 'comparative_literature'],
        culture: ['Buddhist', 'Japanese', 'Asian'],
        context: ['literary'],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'high',
        source_type: 'analysis',
        source: 'Comparative Literature Studies',
        related_concepts: ['symbolism', 'cultural symbols', 'translation', 'interpretation'],
    }),
    createDocument({
        id: 'lit-postcolonial-writing-01',
        text: 'Postcolonial literature engages in acts of linguistic resistance through appropriation and subversion of colonial languages. Writers like Chinua Achebe and Pramoedya Ananta Toer deliberately infuse colonial languages with indigenous rhythms, idioms, and worldviews, creating hybrid literary forms that challenge linguistic hegemony while reaching global audiences.',
        discipline: ['literature', 'cultural_studies'],
        subfield: ['postcolonial_literature', 'postcolonial_studies'],
        culture: ['Postcolonial', 'Nigeria', 'Indonesia'],
        context: ['literary'],
        era: 'contemporary',
        stance: 'critical',
        confidence: 'high',
        source_type: 'book',
        source: 'The Empire Writes Back',
        related_concepts: ['postcolonial literature', 'linguistic resistance', 'hybridity'],
        languages: ['English', 'Indonesian'],
    }),
];

// ============================================
// DISCOURSE ANALYSIS
// ============================================

const DISCOURSE_DOCS: HumanitiesDocument[] = [
    createDocument({
        id: 'disc-turn-taking-01',
        text: 'Turn-taking patterns in conversation vary significantly across cultures. In some cultures, overlapping speech signals engagement and enthusiasm, while in others it constitutes an interruption and face-threat. Pause length between turns also carries cultural meaning: extended pauses may signal thoughtfulness in some contexts or awkwardness in others.',
        discipline: ['linguistics'],
        subfield: ['discourse_analysis', 'pragmatics'],
        culture: ['General', 'Cross-cultural'],
        context: ['general', 'conversation'],
        era: 'contemporary',
        stance: 'descriptive',
        confidence: 'high',
        source_type: 'journal',
        source: 'Conversation Analysis',
        related_concepts: ['turn-taking', 'overlap', 'pause', 'conversation'],
    }),
    createDocument({
        id: 'disc-politeness-western-01',
        text: 'Western politeness theories, while influential, have been critiqued for cultural bias toward individual-focused face-work. Brown and Levinson\'s model assumes universal concern for autonomy (negative face) that may not apply in collectivist cultures where group face and relational harmony take precedence over individual territory.',
        discipline: ['linguistics'],
        subfield: ['pragmatics', 'discourse_analysis'],
        culture: ['Western', 'General'],
        context: ['academic'],
        era: 'contemporary',
        stance: 'critical',
        confidence: 'high',
        source_type: 'journal',
        source: 'Critique of Politeness Theory',
        related_concepts: ['politeness', 'face', 'negative face', 'cultural bias'],
    }),
];

// ============================================
// EXPORT COMBINED KNOWLEDGE BASE
// ============================================

export const HUMANITIES_KNOWLEDGE_BASE: HumanitiesDocument[] = [
    ...PRAGMATICS_DOCS,
    ...SOCIOLINGUISTICS_DOCS,
    ...CULTURAL_STUDIES_DOCS,
    ...LITERATURE_DOCS,
    ...DISCOURSE_DOCS,
];

/**
 * Get documents by discipline
 */
export function getDocumentsByDiscipline(discipline: string): HumanitiesDocument[] {
    return HUMANITIES_KNOWLEDGE_BASE.filter(doc =>
        doc.discipline.some(d => d.toLowerCase() === discipline.toLowerCase())
    );
}

/**
 * Get documents by culture
 */
export function getDocumentsByCulture(culture: string): HumanitiesDocument[] {
    return HUMANITIES_KNOWLEDGE_BASE.filter(doc =>
        doc.culture.some(c => c.toLowerCase().includes(culture.toLowerCase()))
    );
}

/**
 * Get documents by subfield
 */
export function getDocumentsBySubfield(subfield: string): HumanitiesDocument[] {
    return HUMANITIES_KNOWLEDGE_BASE.filter(doc =>
        doc.subfield.some(s => s.toLowerCase() === subfield.toLowerCase())
    );
}

/**
 * Search documents by keyword in text
 */
export function searchDocuments(query: string): HumanitiesDocument[] {
    const queryLower = query.toLowerCase();
    return HUMANITIES_KNOWLEDGE_BASE.filter(doc =>
        doc.text.toLowerCase().includes(queryLower) ||
        doc.related_concepts?.some(c => c.toLowerCase().includes(queryLower))
    );
}

console.log(`📚 Humanities Knowledge Base loaded: ${HUMANITIES_KNOWLEDGE_BASE.length} documents`);
