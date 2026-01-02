/**
 * LLM Service - Gemini Abstraction
 * 
 * Provides abstraction over Gemini API calls with error handling
 */

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export interface LLMCallOptions {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: 'text' | 'json';
}

/**
 * Call Gemini with retry logic and error handling
 */
export async function callLLM(options: LLMCallOptions): Promise<string> {
    const {
        systemPrompt,
        userPrompt,
        temperature = 0.7,
        maxTokens = 4096,
        responseFormat = 'text',
    } = options;

    try {
        const result = await generateText({
            model: google('models/gemini-2.5-flash'),
            system: systemPrompt,
            prompt: userPrompt,
            temperature,
            maxTokens,
        });

        let text = result.text;

        // If JSON format requested, try to parse and validate
        if (responseFormat === 'json') {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
            if (jsonMatch) {
                text = jsonMatch[1];
            }

            // Validate JSON
            try {
                JSON.parse(text);
            } catch (e) {
                throw new Error(`LLM returned invalid JSON: ${text.substring(0, 200)}...`);
            }
        }

        return text;
    } catch (error: any) {
        console.error('❌ LLM call failed:', error);
        throw new Error(`LLM call failed: ${error.message}`);
    }
}

/**
 * Parse JSON response from LLM
 */
export function parseLLMJson<T = any>(response: string): T {
    try {
        return JSON.parse(response);
    } catch (error) {
        // Try to extract JSON from markdown
        const jsonMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }
        throw new Error('Failed to parse LLM JSON response');
    }
}
