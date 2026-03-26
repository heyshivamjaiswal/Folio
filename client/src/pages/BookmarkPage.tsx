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
    bookmarks,
    loading,
    search,
    showAdd,
    activeChat,
    fetchBookmarks,
    setSearch,
    openAdd,
    closeAdd,
    openChat,
    closeChat,
  } = useBookmarkStore();

  useEffect(() => {
    fetchBookmarks(getToken);
  }, []);

  const filtered = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold">Your Library</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {bookmarks.length} resources saved
            </p>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm"
          >
            <Plus size={14} />
            Add Resource
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-sm font-medium">
              {search ? 'No results found' : 'Your library is empty'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <BookmarkCard key={b.id} bookmark={b} onChat={openChat} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAdd && (
        <AddBookmarkModal
          onClose={closeAdd}
          onSuccess={() => fetchBookmarks(getToken)}
        />
      )}

      {activeChat && <ChatBox bookmark={activeChat} onClose={closeChat} />}
    </div>
  );
}
