/**
 * CULTURAL-LINGUISTIC REASONING PIPELINE
 * 
 * Enhanced pipeline for Humanities RAG:
 * 1. Humanities Intent Analysis (discipline + culture classification)
 * 2. Hybrid Retrieval (metadata + semantic + reranking)
 * 3. Interpretive Context Assembly
 * 4. Epistemically Constrained Generation
 * 5. Reviewer/Auditor
 * 6. Schema Validation
 */

import { getJSONSystemPrompt } from '../core/system-prompt';
import { parseArticleResponse, type ArticleOutput } from '../core/schema';
import { renderMarkdown } from '../core/render-markdown';
import { getReviewerInstruction } from '../core/reviewer-prompt';
import { analyzeHumanitiesIntent, buildRagQuery, type HumanitiesIntent } from '../rag/query-builder';
import { hybridRetrieve, retrieveDocuments } from '../rag/retriever';
import { assembleInterpretiveContext, assembleContext, summarizeSources, summarizeHumanitiesDocs } from '../rag/context-assembler';
import { callLLM, parseLLMJson } from '../services/llm';

// ============================================
// PIPELINE OPTIONS
// ============================================

export interface PipelineOptions {
    question: string;
    context?: string;
    enableAuditor?: boolean;
    includeReferences?: boolean;
    useHumanitiesRag?: boolean;
}

export interface PipelineResult {
    article: ArticleOutput;
    markdown: string;
    intent: HumanitiesIntent;
    sources: string[];
}

// ============================================
// MAIN HUMANITIES PIPELINE
// ============================================

/**
 * Main Cultural-Linguistic Reasoning Pipeline (Humanities RAG)
 */
export async function humanitiesPipeline(
    options: PipelineOptions
): Promise<PipelineResult> {
    const {
        question,
        context = '',
        enableAuditor = true,
        includeReferences = true,
    } = options;

    console.log('🧠 Starting Humanities RAG Pipeline...');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STAGE 1: Humanities Intent Analysis
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('📊 Stage 1: Analyzing humanities intent...');
    const intent = await analyzeHumanitiesIntent(question, context);

    console.log(`   Primary Discipline: ${intent.primary_discipline}`);
    console.log(`   Cultures: ${intent.cultures_involved.join(', ')}`);
    console.log(`   Subfields: ${intent.subfields.join(', ')}`);
    console.log(`   Query Type: ${intent.query_type}`);
    console.log(`   Requires Comparison: ${intent.requires_comparison}`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STAGE 2: Hybrid Retrieval
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('📚 Stage 2: Hybrid retrieval...');
    const docs = await hybridRetrieve(question, intent, {
        maxResults: 5,
        preferHighConfidence: true,
        includeRelatedDisciplines: true,
    });
    console.log(`   Retrieved ${docs.length} humanities documents`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STAGE 3: Interpretive Context Assembly
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('📝 Stage 3: Assembling interpretive context...');
    const interpretiveContext = assembleInterpretiveContext(docs, intent);
    const sourceSummaries = summarizeHumanitiesDocs(docs);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STAGE 4: Epistemically Constrained Generation
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('🎯 Stage 4: Generating epistemically constrained response...');

    const systemPrompt = getJSONSystemPrompt();

    const generatorPrompt = `
${interpretiveContext}

ADDITIONAL CONTEXT:
${context}

USER QUESTION:
${question}

DISCIPLINE FOCUS: ${intent.primary_discipline}
CULTURES INVOLVED: ${intent.cultures_involved.join(', ')}
INTERPRETIVE FRAME: ${intent.interpretive_frame}

Generate a well-reasoned response that:
1. Draws on the provided interpretive frameworks
2. Respects cultural specificity (avoid overgeneralization)
3. Acknowledges scholarly variation and uncertainty
4. Uses calibrated language (often, typically, in many contexts)
5. Explains reasoning, not just conclusions

Remember: Output ONLY valid JSON following the article schema.
`;

    let response = await callLLM({
        systemPrompt,
        userPrompt: generatorPrompt,
        temperature: 0.7,
        responseFormat: 'json',
    });

    let articleOutput = parseArticleResponse(response);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STAGE 5: Reviewer/Auditor (if enabled)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (enableAuditor) {
        console.log('🔍 Stage 5: Auditing for epistemic quality...');

        const auditPrompt = `
Review this response for epistemic quality in humanities reasoning:

${JSON.stringify(articleOutput, null, 2)}

Check for:
- Overgeneralization about cultures
- Missing hedging/calibration language
- Unsupported universal claims
- Lack of cultural specificity
- Missing acknowledgment of variation

If issues found, revise and return improved JSON.
If no issues, return the original JSON unchanged.
`;

        try {
            const auditedResponse = await callLLM({
                systemPrompt: 'You are an epistemic quality auditor for humanities responses.',
                userPrompt: auditPrompt,
                temperature: 0.3,
                responseFormat: 'json',
            });

            articleOutput = parseArticleResponse(auditedResponse);
            console.log('   ✅ Response audited and verified');
        } catch (error) {
            console.log('   ⚠️ Audit skipped due to parsing error');
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STAGE 6: Render to Markdown
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('✨ Stage 6: Rendering to markdown...');
    const markdown = renderMarkdown(articleOutput);

    console.log('🎉 Humanities Pipeline complete!\n');

    return {
        article: articleOutput,
        markdown,
        intent,
        sources: includeReferences ? sourceSummaries : [],
    };
}

// ============================================
// LEGACY PIPELINE (Backwards Compatibility)
// ============================================

// Legacy output type
interface CulturalReasoningOutput {
    contextual_application: string;
    cultural_justification: string;
    conflict_reconciliation: string;
    intra_cultural_variation: string;
    pragmatic_interpretation: string;
    stability_note: string;
    references_used: string[];
    answer: string;
}

/**
 * Legacy pipeline for backwards compatibility
 */
export async function culturalPipeline(
    options: PipelineOptions
): Promise<CulturalReasoningOutput> {
    const {
        question,
        context = '',
        enableAuditor = true,
        includeReferences = true,
    } = options;

    console.log('🧠 Starting Cultural-Linguistic Reasoning Pipeline (Legacy)...');

    // Stage 1: Cultural Intent Analysis
    console.log('📊 Stage 1: Analyzing cultural intent...');
    const intent = await buildRagQuery(question, context);
    console.log('   Cultures:', intent.cultures_involved);
    console.log('   Domain:', intent.social_domain);
    console.log('   Type:', intent.query_type);

    // Stage 2: RAG Retrieval
    console.log('📚 Stage 2: Retrieving relevant literature...');
    const docs = await retrieveDocuments(intent, 3);
    console.log(`   Retrieved ${docs.length} documents`);

    const ragContext = assembleContext(docs);
    const sourceSummaries = summarizeSources(docs);

    // Stage 3: Generator
    console.log('🎯 Stage 3: Generating reasoned response...');

    const legacySchemaPrompt = `
You MUST respond in JSON format with the following fields:

{
  "contextual_application": "How you applied context-appropriate norms",
  "cultural_justification": "Cultural practices/constraints that justify your reasoning",
  "conflict_reconciliation": "How you resolved conflicts between cultural frames (if any)",
  "intra_cultural_variation": "Acknowledgment of diversity within cultures",
  "pragmatic_interpretation": "Contextual analysis of pragmatics and implicatures",
  "stability_note": "Confirmation of logical consistency",
  "references_used": ["ref1", "ref2"],
  "answer": "Your human-readable response"
}

ALL fields are required.
`;

    const generatorPrompt = `
${ragContext}

${legacySchemaPrompt}

GROUNDING CONTEXT:
${context}

USER QUESTION:
${question}

Respond with careful cultural-linguistic reasoning following ALL epistemic constraints (a-f).
`;

    let response = await callLLM({
        systemPrompt: 'You are a cultural-linguistic reasoning expert.',
        userPrompt: generatorPrompt,
        temperature: 0.7,
        responseFormat: 'json',
    });

    let reasoningOutput = parseLLMJson<CulturalReasoningOutput>(response);

    // Add retrieved sources to references
    if (includeReferences && sourceSummaries.length > 0) {
        reasoningOutput.references_used = [
            ...sourceSummaries,
            ...(reasoningOutput.references_used || []),
        ];
    }

    // Stage 4: Reviewer/Auditor (if enabled)
    if (enableAuditor) {
        console.log('🔍 Stage 4: Auditing response quality...');

        const reviewInstruction = getReviewerInstruction(JSON.stringify(reasoningOutput, null, 2));

        try {
            const auditedResponse = await callLLM({
                systemPrompt: 'You are an epistemic auditor.',
                userPrompt: reviewInstruction,
                temperature: 0.3,
                responseFormat: 'json',
            });

            reasoningOutput = parseLLMJson<CulturalReasoningOutput>(auditedResponse);
            console.log('   ✅ Response audited and revised');
        } catch (error) {
            console.log('   ⚠️ Audit skipped due to parsing error');
        }
    }

    console.log('🎉 Pipeline complete!\n');
    return reasoningOutput;
}

/**
 * Simple legacy pipeline without epistemic constraints
 */
export async function legacyPipeline(
    question: string,
    context: string = ''
): Promise<string> {
    const result = await humanitiesPipeline({
        question,
        context,
        enableAuditor: false,
        includeReferences: false,
    });

    return result.markdown;
}
