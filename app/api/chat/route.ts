import { streamText, convertToCoreMessages, generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { getJSONSystemPrompt } from '@/lib/core/system-prompt';
import { parseArticleResponse, isArticleOutput } from '@/lib/core/schema';
import { renderMarkdown } from '@/lib/core/render-markdown';

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
`;

// Feature flag for JSON mode
const USE_JSON_MODE = process.env.ENABLE_JSON_OUTPUT !== 'false'; // Default to true

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        console.log('=== API Route Called ===');
        console.log('JSON Mode:', USE_JSON_MODE ? 'ENABLED' : 'DISABLED');
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

        // NEW: JSON Output Mode with deterministic rendering
        if (USE_JSON_MODE) {
            console.log('📋 Using JSON Output Mode with Deterministic Renderer');

            try {
                const systemPrompt = `${getJSONSystemPrompt()}

${FEW_SHOT_EXAMPLES}

Remember: Output ONLY valid JSON following the schema. No markdown, no emojis.`;

                // Generate structured JSON response
                const result = await generateText({
                    model: google('models/gemini-2.5-flash'),
                    messages: convertToCoreMessages(messages),
                    system: systemPrompt,
                });

                console.log('Raw LLM response:', result.text.substring(0, 200));

                // Parse JSON response
                const articleData = parseArticleResponse(result.text);

                // Render to markdown using deterministic renderer
                const formattedMarkdown = renderMarkdown(articleData);

                console.log('✅ JSON parsed and rendered successfully');

                // Return as streaming-compatible response
                // Simulate streaming by wrapping in data stream format
                const encoder = new TextEncoder();
                const stream = new ReadableStream({
                    start(controller) {
                        // Send the formatted content as a text delta
                        const data = `0:${JSON.stringify(formattedMarkdown)}\n`;
                        controller.enqueue(encoder.encode(data));
                        controller.close();
                    }
                });

                return new Response(stream, {
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8',
                        'X-Response-Type': 'article-json',
                    },
                });

            } catch (error: unknown) {
                console.error('❌ JSON Mode Error:', error);
                console.log('⚠️ Falling back to streaming mode...');
                // Fall through to streaming mode
            }
        }

        // FALLBACK: Streaming mode
        console.log('📝 Using Streaming Mode');

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

## Response Style Guidelines:

1. Be well-structured with clear section headings using ## and ###
2. Use short paragraphs (2-4 lines maximum)
3. Avoid bullet overload; use bullets only when they improve clarity
4. Maintain an explanatory, calm, and reflective tone
5. Prioritize conceptual clarity over technical jargon
6. Do NOT use emojis unless explicitly requested
7. Use **bold** only for key concepts

Be conversational, educational, and supportive. Respond in Indonesian if user writes in Indonesian, otherwise use English.`;

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

    } catch (error: unknown) {
        console.error('❌ API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error details:', errorMessage);

        return new Response(JSON.stringify({
            error: errorMessage
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
