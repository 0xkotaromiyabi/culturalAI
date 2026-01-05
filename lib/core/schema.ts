/**
 * OUTPUT SCHEMA - Article-Style Response Contract
 * 
 * This schema separates content, structure, and style.
 * The LLM outputs pure JSON, and the renderer controls formatting.
 * 
 * Design Principles:
 * - No markdown in JSON
 * - No emojis
 * - No inline headings
 * - All structure is explicit
 */

export interface ArticleSection {
    title: string;
    paragraph: string;
    bullets: string[];
}

export interface ArticleOutput {
    intro: {
        text: string; // 2-3 sentences
    };
    sections: ArticleSection[];
    conclusion: {
        text: string; // 1-2 sentences
    };
}

/**
 * Legacy schema for backwards compatibility
 */
export interface CulturalReasoningOutput {
    contextual_application: string;
    cultural_justification: string;
    conflict_reconciliation: string;
    intra_cultural_variation: string;
    pragmatic_interpretation: string;
    stability_note: string;
    references_used: string[];
    answer: string;
}

/**
 * Validate ArticleOutput schema
 */
export function validateArticleSchema(obj: unknown): asserts obj is ArticleOutput {
    if (!obj || typeof obj !== 'object') {
        throw new Error('Response must be a valid object');
    }

    const data = obj as Record<string, unknown>;

    // Validate intro
    if (!data.intro || typeof data.intro !== 'object') {
        throw new Error('Missing or invalid intro object');
    }
    const intro = data.intro as Record<string, unknown>;
    if (typeof intro.text !== 'string') {
        throw new Error('intro.text must be a string');
    }

    // Validate sections
    if (!Array.isArray(data.sections)) {
        throw new Error('sections must be an array');
    }
    for (let i = 0; i < data.sections.length; i++) {
        const section = data.sections[i] as Record<string, unknown>;
        if (typeof section.title !== 'string') {
            throw new Error(`sections[${i}].title must be a string`);
        }
        if (typeof section.paragraph !== 'string') {
            throw new Error(`sections[${i}].paragraph must be a string`);
        }
        if (!Array.isArray(section.bullets)) {
            throw new Error(`sections[${i}].bullets must be an array`);
        }
        for (let j = 0; j < section.bullets.length; j++) {
            if (typeof section.bullets[j] !== 'string') {
                throw new Error(`sections[${i}].bullets[${j}] must be a string`);
            }
        }
    }

    // Validate conclusion
    if (!data.conclusion || typeof data.conclusion !== 'object') {
        throw new Error('Missing or invalid conclusion object');
    }
    const conclusion = data.conclusion as Record<string, unknown>;
    if (typeof conclusion.text !== 'string') {
        throw new Error('conclusion.text must be a string');
    }
}

/**
 * Type guard for ArticleOutput
 */
export function isArticleOutput(obj: unknown): obj is ArticleOutput {
    try {
        validateArticleSchema(obj);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get the JSON schema prompt for LLM
 */
export function getArticleSchemaPrompt(): string {
    return `You must output ONLY valid JSON.

Follow this schema exactly:

{
  "intro": { "text": "string (2-3 sentences)" },
  "sections": [
    {
      "title": "string",
      "paragraph": "string",
      "bullets": ["string"]
    }
  ],
  "conclusion": { "text": "string (1-2 sentences)" }
}

Rules:
- Do not include markdown symbols (no #, **, -, etc.)
- Do not include emojis
- Do not include greetings
- Paragraphs must be concise and explanatory
- Bullets must be short phrases, not paragraphs
- If bullets are not needed, return an empty array

If the output is not valid JSON, the answer is invalid.`;
}

/**
 * Parse JSON from LLM response (handles code blocks)
 */
export function parseArticleResponse(text: string): ArticleOutput {
    // Remove markdown code blocks if present
    let jsonStr = text.trim();

    // Handle ```json ... ``` or ``` ... ```
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
    }

    try {
        const parsed = JSON.parse(jsonStr);
        validateArticleSchema(parsed);
        return parsed;
    } catch (error) {
        // Create fallback response
        return {
            intro: { text: text.slice(0, 200) },
            sections: [{
                title: "Response",
                paragraph: text,
                bullets: []
            }],
            conclusion: { text: "" }
        };
    }
}

// Legacy exports for backwards compatibility
export function validateSchema(obj: unknown): asserts obj is CulturalReasoningOutput {
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

    if (!obj || typeof obj !== 'object') {
        throw new Error('Response must be a valid object');
    }

    const data = obj as Record<string, unknown>;

    for (const field of requiredFields) {
        if (!(field in data)) {
            throw new Error(`Missing epistemic field: ${field}`);
        }
    }

    if (!Array.isArray(data.references_used)) {
        throw new Error('references_used must be an array');
    }
}

export function isCulturalReasoningOutput(obj: unknown): obj is CulturalReasoningOutput {
    try {
        validateSchema(obj);
        return true;
    } catch {
        return false;
    }
}

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
