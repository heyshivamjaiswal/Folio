import { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2 } from 'lucide-react';
import type { Bookmark, Message } from '../type';
import MessageBubble from './MessageBubble';
import { chatWithBookmark } from '../api';
import { useAuth } from '@clerk/clerk-react';

type Props = {
  bookmark: Bookmark;
  onClose: () => void;
};

export default function ChatBox({ bookmark, onClose }: Props) {
  const { getToken } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const data = await chatWithBookmark(getToken, {
        bookmarkId: bookmark.id,
        question: userMessage.content,
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl flex flex-col h-[600px] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div className="min-w-0">
            <p className="text-xs text-[var(--color-muted-foreground)] mb-0.5">
              Chatting with
            </p>
            <h2 className="text-sm font-semibold truncate">{bookmark.title}</h2>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2.5 rounded-2xl bg-[var(--color-border)]">
                <Loader2 size={14} className="animate-spin" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3 border rounded-xl px-4 py-2.5 focus-within:border-black">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 text-sm outline-none"
            />
            <button onClick={handleSend} disabled={!input.trim() || loading}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
