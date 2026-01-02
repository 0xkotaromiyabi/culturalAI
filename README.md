# AI Translation & Error Detection Application

Aplikasi berbasis AI untuk simulasi terjemahan dan deteksi pola kesalahan, dibangun dengan Next.js, Vercel AI SDK, dan Google Gemini.

## Features

- **Streaming AI Responses**: Real-time streaming responses powered by Vercel AI SDK and Google Gemini 2.0 Flash
- **Multi-Language Translation**: Translate seamlessly between:
  - 🇮🇩 Bahasa Indonesia
  - 🇬🇧 English  
  - 🇨🇳 Mandarin/Chinese
- **Comprehensive Error Detection**: Detects 5 types of errors:
  - **Grammar (Tata Bahasa)**: Grammatical mistakes and syntax errors
  - **Context (Konteks)**: Contextual misunderstandings or inappropriate usage
  - **Culture (Budaya)**: Cultural insensitivity or inappropriate cultural references
  - **Semantic (Semantik)**: Meaning discrepancies between source and translation
  - **Pragmatic (Pragmatik)**: Issues with intended meaning, tone, or formality
- **Built-in AI Tools**: Integrated tools for translation, error detection, pattern analysis, and cultural context
- **Modern UI**: Beautiful, responsive interface powered by shadcn/ui and Tailwind CSS
- **Next.js App Router**: Built with the latest Next.js 15 App Router

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI**: Google Gemini 2.0 Flash via Vercel AI SDK
- **UI**: shadcn/ui + Tailwind CSS
- **Language**: TypeScript
- **Tools**: Vercel AI SDK Tools with Zod validation

## Running Locally

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key

### Installation

1. Clone or navigate to the repository:

```bash
cd culturalAI
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. The environment variables are already configured in `.env.local` with your Google Gemini API key.

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage Examples

### Translation
```
"Translate 'Selamat pagi' from Indonesian to English"
```

### Error Detection
```
"Check this translation for errors: 
Original (English): 'Good morning, how are you?'
Translation (Indonesian): 'Selamat pagi, bagaimana kamu?'"
```

### Cultural Analysis
```
"Is this culturally appropriate in Chinese: '给你钱' as a gift phrase?"
```

### Pattern Analysis
```
"I've been making translation mistakes. Can you analyze common patterns in my errors?"
```

## Project Structure

```
culturalAI/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Streaming chat API endpoint
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main page
│   └── globals.css                # Global styles
├── components/
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   └── tabs.tsx
│   └── chat-interface.tsx         # Main chat interface
├── lib/
│   ├── ai/
│   │   ├── client.ts              # AI client setup
│   │   └── tools.ts               # AI tools (translate, detect, analyze)
│   └── utils.ts                   # Utility functions
└── .env.local                     # Environment variables
```

## AI Tools

The application includes several built-in AI tools:

### 1. Translation Tool
Translates text between Indonesian, English, and Mandarin with context awareness.

### 2. Error Detection Tool
Analyzes translations for:
- Grammar errors
- Contextual issues
- Cultural inappropriateness
- Semantic discrepancies
- Pragmatic problems

### 3. Pattern Analysis Tool
Identifies recurring error patterns across multiple translations to help improve translation skills.

### 4. Cultural Context Tool
Analyzes cultural appropriateness and provides guidance on cultural sensitivity.

## Deploy Your Own

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/culturalAI)

Don't forget to configure your environment variables:
- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google Gemini API key

## Environment Variables

The application requires the following environment variable:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

## Building for Production

```bash
npm run build
npm start
```

## License

MIT

## Authors

Built with ❤️ using Google Gemini, Next.js, and Vercel AI SDK

