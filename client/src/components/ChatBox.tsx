import { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2 } from 'lucide-react';
import type { Bookmark, Message } from '../type';
import MessageBubble from './MessageBubble';
import ModeToggle from './ModeToggle';
import ChatBackdrop from './ChatBackdrop';
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
  const [mode, setMode] = useState<'narrow' | 'ask-anything'>('narrow');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const question = input.trim();
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: question };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const data = await chatWithBookmark(getToken, {
        bookmarkId: mode === 'narrow' ? bookmark.id : undefined,
        question,
        mode,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
          usedWebFallback: data.usedWebFallback,
          suggestModeSwitch: data.suggestModeSwitch,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Something went wrong. Please try again.' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="rounded-sm w-full max-w-2xl flex flex-col h-[640px] border"
        style={{
          background: 'var(--color-paper)',
          borderColor: 'var(--color-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="min-w-0">
            <p className="text-coordinate mb-0.5">chatting with</p>
            <h2 className="text-sm font-semibold truncate">{bookmark.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle mode={mode} onChange={setMode} />
            <button onClick={onClose} className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 relative">
          <ChatBackdrop />
          <div className="relative z-10 flex flex-col gap-4">
            {messages.length === 0 && (
              <p className="text-coordinate text-center py-12">
                {mode === 'narrow'
                  ? `Ask something about "${bookmark.title}"`
                  : 'Ask anything across everything you\'ve saved'}
              </p>
            )}

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {messages.some((m) => m.suggestModeSwitch) &&
              messages[messages.length - 1]?.suggestModeSwitch && (
                <button
                  onClick={() => setMode('ask-anything')}
                  className="self-start btn-ghost text-xs"
                >
                  Switch to Ask Anything →
                </button>
              )}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2.5 rounded-sm border" style={{ borderColor: 'var(--color-border)' }}>
                  <Loader2 size={14} className="animate-spin" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div
            className="flex items-center gap-3 border rounded-sm px-4 py-2.5 focus-within:border-[var(--color-ink)]"
            style={{ borderColor: 'var(--color-border-strong)' }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === 'narrow' ? 'Ask about this source...' : 'Ask anything...'}
              className="flex-1 text-sm bg-transparent outline-none"
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