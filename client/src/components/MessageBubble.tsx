import type { Message } from '../type';

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-[var(--color-primary)] text-white rounded-br-sm'
            : 'bg-[var(--color-border)] text-[var(--color-foreground)] rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
