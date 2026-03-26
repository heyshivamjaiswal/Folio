import { useState, useRef } from 'react';
import { X, Link2, Upload, Loader2 } from 'lucide-react';
import { addBookmark, uploadPDF } from '../api';
import { useAuth } from '@clerk/clerk-react';

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between mb-4">
          <h2>Add Resource</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste link..."
          className="w-full border p-2 rounded mb-3"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>

        <div className="my-4 text-center text-sm">or</div>

        <input ref={fileRef} type="file" hidden onChange={handlePDF} />

        <button onClick={() => fileRef.current?.click()}>Upload PDF</button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
