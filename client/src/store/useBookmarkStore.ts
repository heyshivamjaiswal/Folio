import { create } from 'zustand';
import type { Bookmark } from '../type';
import { listBookmarks } from '../api';

type State = {
  bookmarks: Bookmark[];
  loading: boolean;
  search: string;
  showAdd: boolean;
  activeChat: Bookmark | null;

  fetchBookmarks: (getToken: () => Promise<string | null>) => Promise<void>;
  setSearch: (val: string) => void;
  openAdd: () => void;
  closeAdd: () => void;
  openChat: (b: Bookmark) => void;
  closeChat: () => void;
};

export const useBookmarkStore = create<State>((set) => ({
  bookmarks: [],
  loading: true,
  search: '',
  showAdd: false,
  activeChat: null,

  fetchBookmarks: async (getToken) => {
    set({ loading: true });
    try {
      const data = await listBookmarks(getToken);
      set({ bookmarks: data.bookmarks || [] });
    } catch {
      console.error('Failed to load bookmarks');
      set({ bookmarks: [] });
    } finally {
      set({ loading: false });
    }
  },

  setSearch: (val) => set({ search: val }),
  openAdd: () => set({ showAdd: true }),
  closeAdd: () => set({ showAdd: false }),
  openChat: (b) => set({ activeChat: b }),
  closeChat: () => set({ activeChat: null }),
}));
