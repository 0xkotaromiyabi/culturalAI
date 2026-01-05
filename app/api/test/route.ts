import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const maxDuration = 30;

export async function GET(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        const hasKey = !!apiKey && apiKey.length > 0;

        console.log('=== TEST ENDPOINT DEBUG ===');
        console.log('API Key present:', hasKey);

        if (!hasKey) {
            return new Response(JSON.stringify({
                error: 'API key missing',
                envDebug: {
                    hasGoogleKey: hasKey,
                    nodeEnv: process.env.NODE_ENV
                }
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const google = createGoogleGenerativeAI({ apiKey });

        // Use generateText instead of streamText to catch initial connection errors
        console.log('Attempting to call Google Gemini API...');

        const result = await generateText({
            model: google('gemini-1.5-flash'),
            messages: [{ role: 'user', content: 'Reply with "OK" only.' }],
        });

        console.log('API Call Success:', result.text);

        return new Response(JSON.stringify({
            status: 'success',
            message: result.text,
            model: 'gemini-1.5-flash'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('=== TEST ENDPOINT ERROR ===');
        console.error(error);

        // Extract as much detail as possible
        const errorDetails = {
            message: error.message,
            name: error.name,
            cause: error.cause,
            stack: error.stack,
            // Google specific error fields often buried in response
            response: error.response,
            status: error.status,
            headers: error.headers
        };

        return new Response(JSON.stringify({
            error: 'API Connection Failed',
            details: errorDetails
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
