/**
 * Cultural-Linguistic Reasoning Pipeline
 * 
 * End-to-end orchestration:
 * 1. Cultural Intent Analysis
 * 2. RAG Retrieval
 * 3. Generator (with epistemic constraints)
 * 4. Reviewer/Auditor
 * 5. Schema Validation
 */

import { getSystemPrompt } from '../core/system-prompt';
import { validateSchema, getSchemaPrompt, type CulturalReasoningOutput } from '../core/schema';
import { getReviewerInstruction } from '../core/reviewer-prompt';
import { buildRagQuery } from '../rag/query-builder';
import { retrieveDocuments } from '../rag/retriever';
import { assembleContext, summarizeSources } from '../rag/context-assembler';
import { callLLM, parseLLMJson } from '../services/llm';
import { fewShotExamples } from '../few-shot-examples';

export interface PipelineOptions {
    question: string;
    context?: string;
    enableAuditor?: boolean;
    includeReferences?: boolean;
}

/**
 * Main Cultural-Linguistic Reasoning Pipeline
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

    console.log('🧠 Starting Cultural-Linguistic Reasoning Pipeline...');

    // STAGE 1: Cultural Intent Analysis
    console.log('📊 Stage 1: Analyzing cultural intent...');
    const intent = await buildRagQuery(question, context);
    console.log('   Cultures:', intent.cultures_involved);
    console.log('   Domain:', intent.social_domain);
    console.log('   Type:', intent.query_type);

    // STAGE 2: RAG Retrieval
    console.log('📚 Stage 2: Retrieving relevant literature...');
    const docs = await retrieveDocuments(intent, 3);
    console.log(`   Retrieved ${docs.length} documents`);

    const ragContext = assembleContext(docs);
    const sourceSummaries = summarizeSources(docs);

    // STAGE 3: Generator with Epistemic Constraints
    console.log('🎯 Stage 3: Generating reasoned response...');
    const systemPrompt = getSystemPrompt(true); // Use epistemic constitution

    const generatorPrompt = `
${systemPrompt}

${ragContext}

${getSchemaPrompt()}

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

    // STAGE 4: Reviewer/Auditor (if enabled)
    if (enableAuditor) {
        console.log('🔍 Stage 4: Auditing response quality...');

        const reviewInstruction = getReviewerInstruction(JSON.stringify(reasoningOutput, null, 2));

        const auditedResponse = await callLLM({
            systemPrompt: 'You are an epistemic auditor.',
            userPrompt: reviewInstruction,
            temperature: 0.3,
            responseFormat: 'json',
        });

        reasoningOutput = parseLLMJson<CulturalReasoningOutput>(auditedResponse);
        console.log('   ✅ Response audited and revised');
    }

    // STAGE 5: Schema Validation
    console.log('✅ Stage 5: Validating output schema...');
    validateSchema(reasoningOutput);

    console.log('🎉 Pipeline complete!\n');
    return reasoningOutput;
}

/**
 * Legacy pipeline for backwards compatibility
 * (Uses existing few-shot system without epistemic constraints)
 */
export async function legacyPipeline(
    question: string,
    context: string = ''
): Promise<string> {
    const systemPrompt = getSystemPrompt(false); // Use legacy prompt

    // Include few-shot examples
    const fewShotContext = fewShotExamples
        .map((ex) => `Example: ${ex.input}\nResponse: ${ex.output}`)
        .join('\n\n');

    const prompt = `
${systemPrompt}

${fewShotContext}

Context: ${context}
Question: ${question}

Provide a helpful, culturally-aware response.
`;

    const response = await callLLM({
        systemPrompt,
        userPrompt: prompt,
        temperature: 0.7,
    });

    return response;
}
