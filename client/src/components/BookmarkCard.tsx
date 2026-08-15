import { FileText, Youtube, Globe, AlignLeft, MessageSquare, Trash2 } from 'lucide-react';
import type { Bookmark } from '../type';
import StatusDot from './StatusDot';

type Props = {
  bookmark: Bookmark;
  onChat: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
};

const typeConfig = {
  article: { icon: Globe, label: 'web' },
  web: { icon: Globe, label: 'web' },
  youtube: { icon: Youtube, label: 'youtube' },
  pdf: { icon: FileText, label: 'pdf' },
  text: { icon: AlignLeft, label: 'text' },
};

export default function BookmarkCard({ bookmark, onChat, onDelete }: Props) {
  const config = typeConfig[bookmark.type] || typeConfig.article;
  const Icon = config.icon;
  const isReady = bookmark.status === 'ready';

  return (
    <div
      className="border rounded-sm p-5 flex flex-col gap-4 transition-colors group"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="flex items-start justify-between">
        <span className="text-eyebrow flex items-center gap-1.5">
          <Icon size={12} />/{config.label}
        </span>
        <StatusDot status={bookmark.status} />
      </div>

      <h3 className="text-sm font-medium leading-snug line-clamp-2">{bookmark.title}</h3>

      {bookmark.status === 'failed' && bookmark.errorMessage && (
        <p className="text-coordinate text-[var(--color-redline)] line-clamp-2">
          ⌖ {bookmark.errorMessage}
        </p>
      )}

      {bookmark.url && bookmark.type !== 'text' && bookmark.status !== 'failed' && (
        <p className="text-coordinate truncate">{bookmark.url}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <span className="text-coordinate">{new Date(bookmark.createdAt).toLocaleDateString()}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(bookmark)}
            className="w-7 h-7 flex items-center justify-center rounded-sm text-[var(--color-ink-muted)] hover:text-[var(--color-redline)] opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete"
          >
            <Trash2 size={13} />
          </button>

          <button
            onClick={() => isReady && onChat(bookmark)}
            disabled={!isReady}
            className="flex items-center gap-1 text-coordinate px-3 py-1.5 rounded-sm border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderColor: 'var(--color-border-strong)' }}
          >
            <MessageSquare size={12} />
            chat
          </button>
        </div>
      </div>
    </div>
  );
}