export type BookmarkType = 'article' | 'youtube' | 'pdf' | 'text';

export type Bookmark = {
  id: number;
  userId: string;
  url: string;
  title: string;
  type: BookmarkType;
  createdAt: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};
