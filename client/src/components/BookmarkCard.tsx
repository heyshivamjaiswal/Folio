import {
  FileText,
  Youtube,
  Globe,
  AlignLeft,
  MessageSquare,
} from 'lucide-react';
import type { Bookmark } from '../type';

type Props = {
  bookmark: Bookmark;
  onChat: (bookmark: Bookmark) => void;
};

const typeConfig = {
  article: { icon: Globe, label: 'Article' },
  youtube: { icon: Youtube, label: 'YouTube' },
  pdf: { icon: FileText, label: 'PDF' },
  text: { icon: AlignLeft, label: 'Text' },
};

export default function BookmarkCard({ bookmark, onChat }: Props) {
  const config = typeConfig[bookmark.type] || typeConfig.article;
  const Icon = config.icon;

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col gap-4 hover:border-black transition-colors">
      <div>
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[var(--color-border)]">
          <Icon size={11} />
          {config.label}
        </span>

        <h3 className="text-sm font-medium mt-2 line-clamp-2">
          {bookmark.title}
        </h3>
      </div>

      {bookmark.url && bookmark.type !== 'text' && (
        <p className="text-xs text-[var(--color-muted-foreground)] truncate">
          {bookmark.url}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-[var(--color-muted-foreground)]">
          {new Date(bookmark.createdAt).toLocaleDateString()}
        </span>

        <button
          onClick={() => onChat(bookmark)}
          className="flex items-center gap-1 text-xs bg-[var(--color-border)] px-3 py-1.5 rounded-md hover:bg-black hover:text-white transition-colors"
        >
          <MessageSquare size={12} />
          Chat
        </button>
      </div>
    </div>
  );
}
