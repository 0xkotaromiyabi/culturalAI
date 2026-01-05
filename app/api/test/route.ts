import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const maxDuration = 30;

export async function GET(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        const hasKey = !!apiKey && apiKey.length > 0;

        console.log('=== TEST ENDPOINT DEBUG: LIST MODELS ===');

        if (!hasKey) {
            return new Response(JSON.stringify({
                error: 'API key missing',
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log('Fetching model list from Google API...');

        // Direct fetch to list models
        const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!listResponse.ok) {
            const errorText = await listResponse.text();
            throw new Error(`Failed to list models: ${listResponse.status} ${listResponse.statusText} - ${errorText}`);
        }

        const data = await listResponse.json();
        const models = data.models || [];

        // Filter for generateContent support
        const supportedModels = models.filter((m: any) =>
            m.supportedGenerationMethods?.includes('generateContent')
        ).map((m: any) => m.name);

        console.log('Available Models:', supportedModels);

        return new Response(JSON.stringify({
            status: 'success',
            message: 'Model list retrieved',
            availableModels: supportedModels,
            rawCount: models.length
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('=== TEST ENDPOINT ERROR ===');
        console.error(error);

        return new Response(JSON.stringify({
            error: 'Failed to list models',
            details: {
                message: error.message,
                name: error.name
            }
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
