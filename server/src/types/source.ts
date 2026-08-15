
export type SourceType = 'pdf' | 'web' | 'youtube' | 'ddg_search';

export type SourceRef = {
    type: SourceType;
    bookmarkId?: number; // absent for ddg_search — it's not tied to a saved bookmark
    url?: string;
    title?: string;
    page?: number;
    startSeconds?: number;
};