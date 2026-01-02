/**
 * OUTPUT SCHEMA - Reasoning Contract
 * 
 * Every Cultural-Linguistic Reasoning response MUST satisfy this schema.
 * This enforces epistemic constraints (a-f) structurally.
 */

export interface CulturalReasoningOutput {
    // (a) Contextual Application
    contextual_application: string;

    // (b) Cultural Justification
    cultural_justification: string;

    // (c) Conflict Reconciliation
    conflict_reconciliation: string;

    // (d) Intra-Cultural Variation
    intra_cultural_variation: string;

    // (e) Pragmatic Interpretation
    pragmatic_interpretation: string;

    // (f) Stability & Consistency
    stability_note: string;

    // Supporting evidence
    references_used: string[];

    // Human-readable answer
    answer: string;
}

/**
 * Schema validation - throws if missing required fields
 */
export function validateSchema(obj: any): asserts obj is CulturalReasoningOutput {
    const requiredFields: (keyof CulturalReasoningOutput)[] = [
        'contextual_application',
        'cultural_justification',
        'conflict_reconciliation',
        'intra_cultural_variation',
        'pragmatic_interpretation',
        'stability_note',
        'references_used',
        'answer',
    ];

    for (const field of requiredFields) {
        if (!(field in obj)) {
            throw new Error(`Missing epistemic field: ${field}`);
        }
    }

    // Validate that references_used is an array
    if (!Array.isArray(obj.references_used)) {
        throw new Error('references_used must be an array');
    }
}

/**
 * Create schema prompt for LLM
 */
export function getSchemaPrompt(): string {
    return `
You MUST respond in JSON format with the following fields:

{
  "contextual_application": "How you applied context-appropriate norms",
  "cultural_justification": "Cultural practices/constraints that justify your reasoning",
  "conflict_reconciliation": "How you resolved conflicts between cultural frames (if any)",
  "intra_cultural_variation": "Acknowledgment of diversity within cultures",
  "pragmatic_interpretation": "Contextual analysis of pragmatics and implicatures",
  "stability_note": "Confirmation of logical consistency",
  "references_used": ["ref1", "ref2"],
  "answer": "Your human-readable response"
}

ALL fields are required.
`;
}

/**
 * Type guard for validation
 */
export function isCulturalReasoningOutput(obj: any): obj is CulturalReasoningOutput {
    try {
        validateSchema(obj);
        return true;
    } catch {
        return false;
    }
}
