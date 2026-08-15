// services/tools/webSearchTool.ts
import { tavily } from '@tavily/core';
import type { SourceRef } from '../../types/source.js';

export type WebSearchResult = {
    contextBlock: string;
    sources: SourceRef[];
};

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function webSearchFallback(query: string, maxResults = 3): Promise<WebSearchResult> {
    try {
        const results = await client.search(query, {
            maxResults,
            searchDepth: 'basic',
        });

        const top = results.results.slice(0, maxResults);

        if (!top.length) {
            return { contextBlock: '', sources: [] };
        }

        const contextBlock = top
            .map((r) => `[Web search result: ${r.title}]\n${r.content}`)
            .join('\n\n---\n\n');

        const sources: SourceRef[] = top.map((r) => ({
            type: 'ddg_search', // keeping this literal for now — see note below
            url: r.url,
            title: r.title,
        }));

        return { contextBlock, sources };
    } catch (err) {
        console.error('[webSearchFallback error]', err instanceof Error ? err.message : err);
        return { contextBlock: '', sources: [] };
    }
}