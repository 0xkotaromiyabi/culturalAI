/**
 * Knowledge Retriever
 * 
 * Retrieves relevant cultural-linguistic examples from Pinecone vector DB
 * Initially uses few-shot examples, can be extended with ethnography papers
 */

import { fewShotExamples, type FewShotExample } from '../few-shot-examples';
import type { CulturalIntent } from './query-builder';

export interface RetrievedDocument {
    id: string;
    text: string;
    cultures: string[];
    domain: string[];
    source_type: 'few-shot' | 'ethnography' | 'linguistics';
    confidence: 'high' | 'medium' | 'low';
    metadata?: Record<string, any>;
}

/**
 * Search few-shot examples based on cultural intent
 * (In-memory implementation - will be replaced with Pinecone)
 */
export async function retrieveDocuments(
    intent: CulturalIntent,
    maxResults: number = 3
): Promise<RetrievedDocument[]> {
    // For MVP: Simple keyword matching against few-shot examples
    const results: RetrievedDocument[] = [];

    for (const example of fewShotExamples) {
        let relevanceScore = 0;

        // Check if example category matches intent
        const categoryLower = example.category.toLowerCase();
        const domainLower = intent.social_domain.toLowerCase();

        if (categoryLower.includes(domainLower) || domainLower.includes('general')) {
            relevanceScore += 2;
        }

        // Check key concepts in input/output
        for (const concept of intent.key_concepts) {
            const conceptLower = concept.toLowerCase();
            if (
                example.input.toLowerCase().includes(conceptLower) ||
                example.output.toLowerCase().includes(conceptLower)
            ) {
                relevanceScore += 1;
            }
        }

        if (relevanceScore > 0) {
            results.push({
                id: example.id,
                text: `${example.input}\n\n${example.output}`,
                cultures: extractCultures(example.output),
                domain: [example.category],
                source_type: 'few-shot',
                confidence: relevanceScore >= 3 ? 'high' : relevanceScore >= 2 ? 'medium' : 'low',
                metadata: {
                    category: example.category,
                    subcategory: example.subcategory,
                    relevance_score: relevanceScore,
                },
            });
        }
    }

    // Sort by relevance and return top results
    return results
        .sort((a, b) => (b.metadata?.relevance_score || 0) - (a.metadata?.relevance_score || 0))
        .slice(0, maxResults);
}

/**
 * Extract culture names from example text (simple heuristic)
 */
function extractCultures(text: string): string[] {
    const cultures: string[] = [];
    const culturalKeywords = [
        'Indonesian',
        'English',
        'Chinese',
        'Mandarin',
        'Western',
        'Asian',
        'Japanese',
    ];

    for (const culture of culturalKeywords) {
        if (text.includes(culture)) {
            cultures.push(culture);
        }
    }

    return cultures.length > 0 ? cultures : ['General'];
}

/**
 * Future: Pinecone vector search implementation
 * 
 * import { Pinecone } from '@pinecone-database/pinecone';
 * 
 * export async function retrieveFromPinecone(
 *   query: string,
 *   intent: CulturalIntent
 * ): Promise<RetrievedDocument[]> {
 *   const pc = new Pinecone({
 *     apiKey: process.env.PINECONE_API_KEY!,
 *   });
 *   
 *   const index = pc.index('cultural-reasoning');
 *   
 *   // Generate embedding for query
 *   // Search vector database
 *   // Transform results to RetrievedDocument format
 * }
 */
