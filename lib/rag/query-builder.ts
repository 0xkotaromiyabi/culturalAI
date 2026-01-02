/**
 * Cultural Intent Analyzer
 * 
 * Extracts cultural intent from user queries to build targeted RAG queries
 */

import { callLLM, parseLLMJson } from '../services/llm';

export interface CulturalIntent {
    cultures_involved: string[];
    social_domain: string;
    potential_conflicts: string[];
    key_concepts: string[];
    query_type: 'translation' | 'error_analysis' | 'cultural_explanation' | 'general';
}

const INTENT_ANALYSIS_PROMPT = `
You are a cultural intent analyzer. Extract structured information from user queries.

Identify:
1. Cultures involved (e.g., ["Indonesian", "English", "Chinese"])
2. Social domain (e.g., "greetings", "formality", "family relations")
3. Potential norm conflicts between cultures
4. Key concepts for literature/ethnography search
5. Query type (translation | error_analysis | cultural_explanation | general)

Return ONLY JSON in this format:
{
  "cultures_involved": ["culture1", "culture2"],
  "social_domain": "domain name",
  "potential_conflicts": ["conflict1", "conflict2"],
  "key_concepts": ["concept1", "concept2"],
  "query_type": "translation"
}
`;

/**
 * Build RAG query from user input
 */
export async function buildRagQuery(
    question: string,
    context?: string
): Promise<CulturalIntent> {
    const userPrompt = `
User Question: ${question}

${context ? `Additional Context: ${context}` : ''}

Extract cultural intent from this query.
`;

    try {
        const response = await callLLM({
            systemPrompt: INTENT_ANALYSIS_PROMPT,
            userPrompt,
            temperature: 0.3,
            responseFormat: 'json',
        });

        const intent = parseLLMJson<CulturalIntent>(response);

        // Validate required fields
        if (!intent.cultures_involved || !intent.social_domain || !intent.key_concepts) {
            throw new Error('Invalid intent structure');
        }

        return intent;
    } catch (error: any) {
        console.error('❌ Failed to build RAG query:', error);

        // Fallback intent
        return {
            cultures_involved: ['General'],
            social_domain: 'general communication',
            potential_conflicts: [],
            key_concepts: [question.substring(0, 50)],
            query_type: 'general',
        };
    }
}
