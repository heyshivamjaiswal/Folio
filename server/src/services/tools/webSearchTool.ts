import { search, SafeSearchType } from 'duck-duck-scrape';
import type { SourceRef } from '../../types/source.js';

export type WebSearchResult = {
    contextBlock: string;
    sources: SourceRef[];
};

export async function webSearchFallback(query: string, maxResults = 3): Promise<WebSearchResult> {
    try {
        const results = await search(query, { safeSearch: SafeSearchType.MODERATE });

        const top = results.results.slice(0, maxResults);

        if (!top.length) {
            return { contextBlock: '', sources: [] };
        }

        const contextBlock = top
            .map((r) => `[Web search result: ${r.title}]\n${r.description}`)
            .join('\n\n---\n\n');

        const sources: SourceRef[] = top.map((r) => ({
            type: 'ddg_search',
            url: r.url,
            title: r.title,
        }));

        return { contextBlock, sources };
    } catch (err) {
        console.error('[webSearchFallback error]', err instanceof Error ? err.message : err);
        return { contextBlock: '', sources: [] };
    }
}