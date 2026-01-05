import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const maxDuration = 30;

export async function GET(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        console.log('=== TEST ENDPOINT DEBUG: VERIFY MODEL ===');

        if (!apiKey) {
            return new Response(JSON.stringify({
                error: 'API key missing',
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const google = createGoogleGenerativeAI({ apiKey });
        const modelName = 'gemini-2.0-flash'; // Confirmed from list

        console.log(`Attempting to call Google Gemini API with model: ${modelName}...`);

        const result = await generateText({
            model: google(modelName),
            messages: [{ role: 'user', content: 'Reply with "OK" only.' }],
        });

        console.log('API Call Success:', result.text);

        return new Response(JSON.stringify({
            status: 'success',
            message: result.text,
            model: modelName
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('=== TEST ENDPOINT ERROR ===');
        console.error(error);

        return new Response(JSON.stringify({
            error: 'API Connection Failed',
            details: {
                message: error.message,
                name: error.name,
                response: error.response
            }
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
