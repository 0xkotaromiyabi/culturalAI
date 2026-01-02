export async function GET() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
        return Response.json({ error: 'No API key found' }, { status: 500 });
    }

    try {
        // List all available models
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const data = await response.json();

        // Extract model names that support generateContent
        const modelNames = data.models
            ?.filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
            ?.map((m: any) => ({
                name: m.name,
                displayName: m.displayName,
                description: m.description
            })) || [];

        return Response.json({
            success: response.ok,
            status: response.status,
            availableModels: modelNames,
            fullData: data
        });

    } catch (error: any) {
        return Response.json({
            error: error.message
        }, { status: 500 });
    }
}
