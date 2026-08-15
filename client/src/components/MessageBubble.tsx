
import type { Message } from '../type';
import SourceChip from './SourceChip';

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-sm text-sm leading-relaxed border ${isUser
            ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
            : 'bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-border)]'
          }`}
      >
        {message.content}
      </div>

      {message.usedWebFallback && !isUser && (
        <p className="text-coordinate text-[var(--color-blueline)]">
          ⌖ includes results from the open web
        </p>
      )}

      {!!message.sources?.length && (
        <div className="flex flex-wrap gap-1.5 max-w-[80%]">
          {message.sources.map((s, i) => (
            <SourceChip key={i} source={s} />
          ))}
        </div>
      )}
    </div>
  );
}