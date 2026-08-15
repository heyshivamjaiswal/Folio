import { searchChunks, searchAllChunks } from '../searchChunks.js';
import { buildContext } from '../buildcontext.js';
import { webSearchFallback } from '../tools/webSearchTool.js';
import { isRetrievalSufficient } from './relevance.js';
import { askLLM } from '../../llm/generateAnswer.js';
import type { SourceRef } from '../../types/source.js';

export type ChatMode = 'narrow' | 'ask-anything';

type AnswerQuestionParams = {
    question: string;
    userId: string;
    mode: ChatMode;
    bookmarkId?: number; // required for 'narrow', ignored for 'ask-anything'
};

const NOT_FOUND_MESSAGE =
    "Sorry, I couldn't find an answer to that in this saved content. Try switching to Ask Anything mode to search the web as well.";

export async function answerQuestion({ question, userId, mode, bookmarkId }: AnswerQuestionParams) {
    if (mode === 'narrow' && !bookmarkId) {
        throw new Error('bookmarkId is required in narrow mode');
    }

    const matches =
        mode === 'narrow'
            ? await searchChunks(question, bookmarkId!, userId)
            : await searchAllChunks(question, userId);

    const sufficient = isRetrievalSufficient(matches);
    const { context: savedContext, sources: savedSources } = await buildContext(matches);

    // Narrow mode + no good match → don't call the LLM, don't fall back to web
    if (mode === 'narrow' && !sufficient) {
        return {
            answer: NOT_FOUND_MESSAGE,
            sources: [],
            usedWebFallback: false,
            suggestModeSwitch: true,
        };
    }

    let finalContext = savedContext;
    let allSources: SourceRef[] = savedSources;
    let usedWebFallback = false;

    // Ask-anything mode + insufficient saved content → fall back to web
    if (mode === 'ask-anything' && !sufficient) {
        const { contextBlock, sources: webSources } = await webSearchFallback(question);

        if (contextBlock) {
            usedWebFallback = true;
            finalContext = savedContext ? `${savedContext}\n\n---\n\n${contextBlock}` : contextBlock;
            allSources = [...savedSources, ...webSources];
        } else {
            // Even the web search came back empty
            return {
                answer: "I couldn't find an answer to that, either in your saved content or a web search.",
                sources: [],
                usedWebFallback: false,
                suggestModeSwitch: false,
            };
        }
    }

    const answer = await askLLM(finalContext, question, usedWebFallback);

    return {
        answer,
        sources: allSources,
        usedWebFallback,
        suggestModeSwitch: false,
    };
}