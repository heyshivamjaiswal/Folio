
import { useState, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import { addBookmark, uploadPDF } from '../api';
import { useAuth } from '@clerk/clerk-react';

type Props = { onClose: () => void; onSuccess: () => void };

export default function AddBookmarkModal({ onClose, onSuccess }: Props) {
  const { getToken } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAdd() {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    try {
      await addBookmark(getToken, { url: input.trim() });
      onSuccess();
      onClose();
    } catch {
      setError('Failed to add resource');
    } finally {
      setLoading(false);
    }
  }

  async function handlePDF(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      await uploadPDF(getToken, file);
      onSuccess();
      onClose();
    } catch {
      setError('Failed to upload PDF');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="rounded-sm p-6 w-full max-w-md border"
        style={{ background: 'var(--color-paper)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex justify-between items-center mb-5">
          <p className="text-eyebrow">// add resource</p>
          <button onClick={onClose} className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
            <X size={18} />
          </button>
        </div>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="paste a link — article or youtube"
          className="w-full border rounded-sm p-2.5 mb-3 text-sm font-mono outline-none focus:border-[var(--color-ink)]"
          style={{ borderColor: 'var(--color-border-strong)', background: 'var(--color-surface)' }}
        />

        <button onClick={handleAdd} disabled={loading || !input.trim()} className="btn-locator w-full flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'add'}
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          <span className="text-coordinate">or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
        </div>

        <input ref={fileRef} type="file" accept="application/pdf" hidden onChange={handlePDF} />
        <button onClick={() => fileRef.current?.click()} disabled={loading} className="btn-ghost w-full">
          upload a pdf
        </button>

        {error && <p className="text-coordinate text-[var(--color-redline)] mt-3">⌖ {error}</p>}
      </div>
    </div>
  );
}