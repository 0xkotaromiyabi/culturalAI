import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const maxDuration = 30;

export async function GET(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({
                error: 'API key not configured',
                envVars: Object.keys(process.env).filter(k => k.includes('GOOGLE'))
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const google = createGoogleGenerativeAI({ apiKey });

        const result = streamText({
            model: google('gemini-1.5-flash'),
            messages: [{ role: 'user', content: 'Say "API is working!" in one sentence.' }],
        });

        return result.toDataStreamResponse();

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
