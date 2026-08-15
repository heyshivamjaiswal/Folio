
export type BookmarkType = 'article' | 'youtube' | 'pdf' | 'text' | 'web';
export type BookmarkStatus = 'pending' | 'processing' | 'ready' | 'failed';
export type SourceType = 'pdf' | 'web' | 'youtube' | 'ddg_search';

export type SourceRef = {
  type: SourceType;
  bookmarkId?: number;
  url?: string;
  title?: string;
  page?: number;
  startSeconds?: number;
  label: string;
  link: string | null;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceRef[];
  usedWebFallback?: boolean;
  suggestModeSwitch?: boolean;
};

export type Bookmark = {
  id: number;
  userId: string;
  url: string;
  title: string;
  type: BookmarkType;
  status: BookmarkStatus;
  errorMessage?: string | null;
  createdAt: string;
};