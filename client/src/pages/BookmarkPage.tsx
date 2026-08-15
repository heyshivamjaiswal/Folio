import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import BookmarkCard from '../components/BookmarkCard';
import SearchBar from '../components/SearchBar';
import AddBookmarkModal from '../components/AddBookmarkModal';
import ChatBox from '../components/ChatBox';
import { useBookmarkStore } from '../store/useBookmarkStore';
import { useAuth } from '@clerk/clerk-react';

export default function BookmarksPage() {
  const { getToken } = useAuth();

  const {
    bookmarks, loading, search, showAdd, activeChat,
    fetchBookmarks, setSearch, openAdd, closeAdd, openChat, closeChat, deleteBookmark,
  } = useBookmarkStore();

  useEffect(() => {
    fetchBookmarks(getToken);
  }, []);

  // Poll while anything is still ingesting, so status updates without a manual refresh
  useEffect(() => {
    const hasPending = bookmarks.some((b) => b.status === 'pending' || b.status === 'processing');
    if (!hasPending) return;

    const interval = setInterval(() => {
      fetchBookmarks(getToken);
    }, 4000);

    return () => clearInterval(interval);
  }, [bookmarks]);

  const filtered = bookmarks.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-paper)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-eyebrow mb-1">// your library</p>
            <h1 className="text-display text-2xl">{bookmarks.length} sources saved</h1>
          </div>
          <button onClick={openAdd} className="btn-locator flex items-center gap-2">
            <Plus size={14} />
            add
          </button>
        </div>

        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 rounded-sm animate-pulse" style={{ background: 'var(--color-surface)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 border rounded-sm" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-coordinate">
              {search ? 'no matches — try a different search' : 'nothing saved yet — add your first source'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <BookmarkCard
                key={b.id}
                bookmark={b}
                onChat={openChat}
                onDelete={(bookmark) => deleteBookmark(getToken, bookmark)}
              />
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddBookmarkModal onClose={closeAdd} onSuccess={() => fetchBookmarks(getToken)} />}
      {activeChat && <ChatBox bookmark={activeChat} onClose={closeChat} />}
    </div>
  );
}