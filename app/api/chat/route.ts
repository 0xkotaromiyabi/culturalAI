import { streamText, convertToCoreMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { culturalPipeline, legacyPipeline } from '@/lib/pipeline/cultural-pipeline';
import type { CulturalReasoningOutput } from '@/lib/core/schema';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const FEW_SHOT_EXAMPLES = `
# Few-Shot Examples: Cultural-Linguistic Reasoning

## Example 1: Cultural–Linguistic Reasoning (Pragmatics & Social Norms)

**Question:** Why does the question "Sudah menikah?" sound polite in Indonesian but intrusive in English-speaking cultures?

**Analysis:**
- **Literal Meaning:** The phrase asks about a person's marital status.
- **Linguistic Perspective:** In Indonesian pragmatics, personal questions are used for social bonding.
- **Cultural Assumption:** Indonesian culture assumes communal identity; Western cultures prioritize privacy.
- **Social Norm:** Asking about marriage signals care in Indonesian society; in English cultures it can imply judgment.
- **Teaching Note:** Focus on *when* and *to whom* a question is socially appropriate.

[Additional examples omitted for brevity - see lib/few-shot-examples.ts]
`;

// Feature flag check
const USE_CULTURAL_REASONING = process.env.ENABLE_CULTURAL_REASONING === 'true';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        console.log('=== API Route Called ===');
        console.log('Cultural Reasoning Mode:', USE_CULTURAL_REASONING ? 'ENABLED' : 'DISABLED (Legacy)');
        console.log('API Key present:', apiKey ? 'YES' : 'NO');

        if (!apiKey) {
            console.error('❌ No API key found');
            return new Response(JSON.stringify({ error: 'API key not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Extract latest user message
        const lastMessage = messages[messages.length - 1];
        const userQuestion = lastMessage.content;

        // Build context from conversation history
        const context = messages
            .slice(0, -1)
            .map((m: any) => `${m.role}: ${m.content}`)
            .join('\n');

        // NEW ARCHITECTURE: Cultural-Linguistic Reasoning Pipeline
        if (USE_CULTURAL_REASONING) {
            console.log('🧠 Using Cultural-Linguistic Reasoning Pipeline');

            try {
                const reasoning = await culturalPipeline({
                    question: userQuestion,
                    context,
                    enableAuditor: true,
                    includeReferences: true,
                });

                // Format structured response for streaming
                const formattedResponse = formatReasoningOutput(reasoning);

                // Return structured response (streaming simulation)
                return new Response(
                    JSON.stringify({
                        type: 'cultural_reasoning',
                        data: reasoning,
                        formatted: formattedResponse,
                    }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            } catch (error: any) {
                console.error('❌ Cultural Pipeline Error:', error);
                console.log('⚠️ Falling back to legacy mode...');
                // Fall through to legacy mode
            }
        }

        // LEGACY MODE: Original streaming implementation
        console.log('📝 Using Legacy Streaming Mode');

        const systemPrompt = `You are an advanced AI translation assistant specializing in Indonesian, English, and Mandarin/Chinese languages with deep cultural-linguistic reasoning capabilities.

${FEW_SHOT_EXAMPLES}

## Your Core Functions:

1. **Translation with Cultural Context**: Provide accurate translations that preserve cultural nuances
2. **5-Type Error Detection**:
   - **Grammar (Tata Bahasa)**: Grammatical mistakes and syntax errors
   - **Context (Konteks)**: Contextual misunderstandings or inappropriate usage
   - **Culture (Budaya)**: Cultural insensitivity or inappropriate cultural references
   - **Semantic (Semantik)**: Meaning discrepancies between source and translation
   - **Pragmatic (Pragmatik)**: Issues with intended meaning, tone, or formality
3. **Cultural-Linguistic Reasoning**: Analyze WHY certain expressions work in one culture but not another
4. **Pattern Recognition**: Identify recurring error patterns to help users improve

## CRITICAL: Response Formatting Rules

ALWAYS format responses with structured markdown for maximum readability:

1. **Semantic Headings**: Use ## for main sections, ### for subsections. Start with summary, then details.

2. **Chunking**: Break into short paragraphs 2-3 sentences. Use bullet points and numbered lists.

3. **Callout Icons** - Use these for emphasis:
   - ✅ Correct Usage
   - ❌ Common Mistake
   - 💡 Tip
   - ⚠️ Important
   - 🌍 Cultural Note
   - 📊 Pattern

4. **Tables**: Use markdown tables for comparisons between languages or error types.

5. **Progressive Disclosure**: Quick answer first, then detailed explanation.

Be conversational, educational, and supportive. Use examples from the few-shot dataset. Respond in Indonesian if user writes in Indonesian, otherwise use English.`;

        const result = streamText({
            model: google('models/gemini-2.5-flash'),
            messages: convertToCoreMessages(messages),
            system: systemPrompt,
            async onFinish({ text, finishReason }) {
                console.log('✅ Stream finished');
                console.log('Finish reason:', finishReason);
                console.log('Generated text length:', text?.length || 0);
            },
        });

        console.log('📤 Sending stream response...');
        return result.toDataStreamResponse();

    } catch (error: any) {
        console.error('❌ API Error:', error);
        console.error('Error details:', error.message);

        return new Response(JSON.stringify({
            error: error.message || 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

/**
 * Format Cultural Reasoning Output for display
 */
function formatReasoningOutput(reasoning: CulturalReasoningOutput): string {
    return `
## ${reasoning.answer}

### 🎯 Epistemic Analysis

#### (a) Contextual Application
${reasoning.contextual_application}

#### (b) Cultural Justification
${reasoning.cultural_justification}

#### (c) Conflict Reconciliation
${reasoning.conflict_reconciliation}

#### (d) Intra-Cultural Variation
${reasoning.intra_cultural_variation}

#### (e) Pragmatic Interpretation
${reasoning.pragmatic_interpretation}

#### (f) Stability & Consistency
${reasoning.stability_note}

### 📚 References Used
${reasoning.references_used.map((ref, idx) => `${idx + 1}. ${ref}`).join('\n')}
`.trim();
}
