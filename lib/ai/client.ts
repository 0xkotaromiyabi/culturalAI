import { google } from '@ai-sdk/google';

// Initialize with explicit API key from environment
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
}

// Create provider with configuration from environment
export const model = google('gemini-1.5-flash');
