export async function GET() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
        return Response.json({ error: 'No API key found' }, { status: 500 });
    }

    try {
        // Test with Gemini 2.5 Flash
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: 'Say "Selamat pagi" in English and explain what it means.' }]
                    }]
                }),
            }
        );

        const data = await response.json();

        return Response.json({
            success: response.ok,
            status: response.status,
            data: data,
            generatedText: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text generated'
        });

    } catch (error: any) {
        return Response.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
