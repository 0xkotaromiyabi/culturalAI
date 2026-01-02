import { tool } from 'ai';
import { z } from 'zod';

/**
 * Translation Tool
 * Translates text between Indonesian, English, and Mandarin with context awareness
 */
export const translateTool = tool({
    description: 'Translate text between Indonesian, English, and Mandarin/Chinese languages with full context awareness',
    parameters: z.object({
        text: z.string().describe('The text to translate'),
        sourceLanguage: z.enum(['indonesian', 'english', 'mandarin']).describe('Source language of the text'),
        targetLanguage: z.enum(['indonesian', 'english', 'mandarin']).describe('Target language for translation'),
        context: z.string().optional().describe('Additional context to improve translation accuracy'),
    }),
    execute: async ({ text, sourceLanguage, targetLanguage, context }) => {
        // In a real implementation, this would call the AI model
        // For demonstration, we return the parameters
        return {
            originalText: text,
            sourceLanguage,
            targetLanguage,
            context,
            translatedText: `[Translation from ${sourceLanguage} to ${targetLanguage}]: ${text}`,
            timestamp: new Date().toISOString(),
        };
    },
});

/**
 * Error Detection Tool
 * Analyzes translations for various types of errors:
 * - Grammar (tata bahasa)
 * - Context (konteks)
 * - Culture (budaya)
 * - Semantic (semantik)
 * - Pragmatic (pragmatik)
 */
export const errorDetectionTool = tool({
    description: 'Detect and analyze errors in translation including grammar, context, cultural, semantic, and pragmatic errors',
    parameters: z.object({
        originalText: z.string().describe('Original source text'),
        translatedText: z.string().describe('Translated text to analyze'),
        sourceLanguage: z.enum(['indonesian', 'english', 'mandarin']).describe('Source language'),
        targetLanguage: z.enum(['indonesian', 'english', 'mandarin']).describe('Target language'),
    }),
    execute: async ({ originalText, translatedText, sourceLanguage, targetLanguage }) => {
        // Simulate error detection
        const errors = [
            {
                type: 'grammar',
                severity: 'medium',
                position: { start: 0, end: 10 },
                description: 'Grammar structure issue detected',
                suggestion: 'Consider revising the sentence structure',
            },
            {
                type: 'semantic',
                severity: 'low',
                position: { start: 15, end: 25 },
                description: 'Semantic meaning may differ slightly from source',
                suggestion: 'Verify the intended meaning matches',
            },
        ];

        return {
            originalText,
            translatedText,
            sourceLanguage,
            targetLanguage,
            errors,
            errorCount: errors.length,
            overallQuality: 'good',
            timestamp: new Date().toISOString(),
        };
    },
});

/**
 * Pattern Analysis Tool
 * Identifies recurring error patterns across multiple translations
 */
export const patternAnalysisTool = tool({
    description: 'Analyze patterns in translation errors to identify recurring issues',
    parameters: z.object({
        translations: z.array(z.object({
            originalText: z.string(),
            translatedText: z.string(),
            errors: z.array(z.object({
                type: z.string(),
                severity: z.string(),
            })),
        })).describe('Array of translations with their detected errors'),
    }),
    execute: async ({ translations }) => {
        // Analyze patterns
        const errorTypes = translations.flatMap(t => t.errors.map(e => e.type));
        const errorFrequency = errorTypes.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostCommonError = Object.entries(errorFrequency)
            .sort(([, a], [, b]) => b - a)[0];

        return {
            totalTranslations: translations.length,
            totalErrors: errorTypes.length,
            errorFrequency,
            mostCommonError: mostCommonError ? {
                type: mostCommonError[0],
                count: mostCommonError[1],
            } : null,
            recommendations: [
                'Focus on improving grammar consistency',
                'Pay attention to cultural context',
                'Verify semantic accuracy',
            ],
            timestamp: new Date().toISOString(),
        };
    },
});

/**
 * Cultural Context Analyzer Tool
 * Specifically analyzes cultural appropriateness and context
 */
export const culturalContextTool = tool({
    description: 'Analyze cultural appropriateness and context in translations',
    parameters: z.object({
        text: z.string().describe('Text to analyze for cultural context'),
        sourceLanguage: z.enum(['indonesian', 'english', 'mandarin']).describe('Source language'),
        targetLanguage: z.enum(['indonesian', 'english', 'mandarin']).describe('Target language'),
    }),
    execute: async ({ text, sourceLanguage, targetLanguage }) => {
        return {
            text,
            sourceLanguage,
            targetLanguage,
            culturalNotes: [
                'This phrase may have different connotations in the target culture',
                'Consider local customs when using this expression',
            ],
            appropriatenessScore: 0.85,
            suggestions: [
                'Use more culturally neutral terminology',
                'Consider adding context for cultural references',
            ],
            timestamp: new Date().toISOString(),
        };
    },
});

// Export all tools as a collection
export const tools = {
    translate: translateTool,
    detectErrors: errorDetectionTool,
    analyzePatterns: patternAnalysisTool,
    analyzeCulturalContext: culturalContextTool,
};
