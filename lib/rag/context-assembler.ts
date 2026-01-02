/**
 * Context Assembler
 * 
 * Formats retrieved documents into structured context for LLM grounding
 */

import type { RetrievedDocument } from './retriever';

/**
 * Assemble retrieved documents into formatted context
 */
export function assembleContext(docs: RetrievedDocument[]): string {
    if (docs.length === 0) {
        return 'No specific literature references found. Reason from general principles.';
    }

    const sections = docs.map((doc, idx) => {
        const header = `
=== Reference ${idx + 1} ===
[Source: ${doc.source_type} | Confidence: ${doc.confidence}]
[Cultures: ${doc.cultures.join(', ')}]
[Domain: ${doc.domain.join(', ')}]
`;

        const content = doc.text;

        return `${header}\n${content}`;
    });

    return `
The following literature and ethnographic references are provided as GROUNDING, 
not as universal rules. Use them to inform your reasoning, but apply epistemic 
constraints (a-f) strictly.

${sections.join('\n\n---\n\n')}

CRITICAL REMINDER:
- These references show examples of cultural reasoning
- Do NOT treat them as absolute truth
- Apply contextual judgment
- Acknowledge variation within cultures
`.trim();
}

/**
 * Create a concise summary of retrieved sources
 */
export function summarizeSources(docs: RetrievedDocument[]): string[] {
    return docs.map((doc) => {
        const sourceType = doc.source_type === 'few-shot'
            ? 'Few-Shot Example'
            : doc.source_type === 'ethnography'
                ? 'Ethnographic Study'
                : 'Linguistics Literature';

        return `${sourceType}: ${doc.metadata?.category || doc.domain[0]} (${doc.confidence} confidence)`;
    });
}
