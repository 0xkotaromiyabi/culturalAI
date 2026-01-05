/**
 * INTERPRETIVE CONTEXT ASSEMBLER
 * 
 * Formats retrieved humanities documents for LLM grounding.
 * 
 * Key Principle: Documents are INTERPRETIVE FRAMEWORKS, not facts.
 * The assembled context emphasizes:
 * - Academic grounding (discipline, source type)
 * - Cultural specificity (not universalizing)
 * - Epistemological humility (confidence levels)
 */

import type { HumanitiesDocument } from './document-schema';
import type { HumanitiesIntent } from './query-builder';
import type { RetrievedDocument } from './retriever';

// ============================================
// INTERPRETIVE CONTEXT ASSEMBLY
// ============================================

/**
 * Assemble humanities documents into interpretive context for LLM
 */
export function assembleInterpretiveContext(
    docs: HumanitiesDocument[],
    intent: HumanitiesIntent
): string {
    if (docs.length === 0) {
        return getNoDocumentsMessage(intent);
    }

    const header = getContextHeader(intent);
    const sections = docs.map((doc, idx) => formatDocument(doc, idx));
    const epistemicReminder = getEpistemicReminder(intent);

    return `
${header}

${sections.join('\n\n---\n\n')}

${epistemicReminder}
`.trim();
}

/**
 * Create context header based on intent
 */
function getContextHeader(intent: HumanitiesIntent): string {
    const disciplineLabel = getDisciplineLabel(intent.primary_discipline);
    const culturesLabel = intent.cultures_involved.length > 0
        ? intent.cultures_involved.join(', ')
        : 'general';

    return `
══════════════════════════════════════════════════════════════
INTERPRETIVE GROUNDING CONTEXT
Academic Focus: ${disciplineLabel}
Cultural Context: ${culturesLabel}
══════════════════════════════════════════════════════════════

The following scholarly perspectives are provided as INTERPRETIVE FRAMEWORKS,
not as universal truths. Use them to inform your reasoning while respecting:
- Cultural specificity (avoid overgeneralization)
- Scholarly disagreement (multiple valid interpretations exist)
- Historical contingency (practices change over time)
`;
}

/**
 * Format a single document for context
 */
function formatDocument(doc: HumanitiesDocument, index: number): string {
    const disciplineStr = doc.discipline.join(', ');
    const subfieldStr = doc.subfield.join(', ');
    const cultureStr = doc.culture.join(', ');
    const confidenceLabel = getConfidenceLabel(doc.confidence);
    const stanceLabel = getStanceLabel(doc.stance);

    return `
┌─ Reference ${index + 1} ─────────────────────────────────────┐
│ Source:     ${doc.source} (${doc.source_type})
│ Discipline: ${disciplineStr}
│ Subfield:   ${subfieldStr}
│ Culture:    ${cultureStr}
│ Era:        ${doc.era}
│ Stance:     ${stanceLabel}
│ Confidence: ${confidenceLabel}
└──────────────────────────────────────────────────────────────┘

${doc.text}
`;
}

/**
 * Get epistemic reminder based on intent
 */
function getEpistemicReminder(intent: HumanitiesIntent): string {
    const reminders: string[] = [
        '• Treat these sources as perspectives, not definitive answers',
        '• Acknowledge variation within cultures',
        '• Ground claims in the specific cultural contexts referenced',
    ];

    if (intent.requires_comparison) {
        reminders.push('• When comparing cultures, avoid hierarchical judgments');
        reminders.push('• Note both similarities and differences without valorizing either');
    }

    if (intent.primary_discipline === 'linguistics') {
        reminders.push('• Linguistic patterns describe tendencies, not absolute rules');
    }

    if (intent.primary_discipline === 'cultural_studies') {
        reminders.push('• Cultural practices are dynamic and internally diverse');
    }

    return `
══════════════════════════════════════════════════════════════
EPISTEMIC GUIDELINES FOR REASONING
══════════════════════════════════════════════════════════════
${reminders.join('\n')}
══════════════════════════════════════════════════════════════
`;
}

/**
 * Message when no relevant documents found
 */
function getNoDocumentsMessage(intent: HumanitiesIntent): string {
    return `
No specific scholarly references found for this query.
Reason from general principles of ${getDisciplineLabel(intent.primary_discipline)}.

When reasoning without specific sources:
- Be explicit about the limits of general claims
- Use hedging language (often, typically, in many cases)
- Acknowledge that specific cultural expertise may be needed
- Avoid presenting general patterns as universal truths
`;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getDisciplineLabel(discipline: string): string {
    const labels: Record<string, string> = {
        linguistics: 'Linguistics (Language Studies)',
        literature: 'Literary Studies',
        cultural_studies: 'Cultural Studies',
    };
    return labels[discipline] || discipline;
}

function getConfidenceLabel(confidence: string): string {
    const labels: Record<string, string> = {
        high: '★★★ High (Well-established scholarly consensus)',
        medium: '★★☆ Medium (Generally accepted interpretation)',
        low: '★☆☆ Low (Emerging or contested perspective)',
    };
    return labels[confidence] || confidence;
}

function getStanceLabel(stance: string): string {
    const labels: Record<string, string> = {
        descriptive: 'Descriptive (observing patterns)',
        prescriptive: 'Prescriptive (recommending practices)',
        critical: 'Critical (analyzing power dynamics)',
    };
    return labels[stance] || stance;
}

// ============================================
// LEGACY COMPATIBILITY
// ============================================

/**
 * Legacy function for backwards compatibility
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
        return `${header}\n${doc.text}`;
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

/**
 * Summarize humanities documents
 */
export function summarizeHumanitiesDocs(docs: HumanitiesDocument[]): string[] {
    return docs.map(doc => {
        const discipline = doc.discipline[0];
        const culture = doc.culture[0] || 'General';
        return `${getDisciplineLabel(discipline)}: ${culture} context (${doc.confidence} confidence) - ${doc.source}`;
    });
}
