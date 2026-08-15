// src/store/useBookmarkStore.ts — add deleteBookmark, wire to the DELETE route we built
import { create } from 'zustand';
import type { Bookmark } from '../type';
import { listBookmarks, deleteBookmarkApi } from '../api';

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
  deleteBookmark: (
    getToken: () => Promise<string | null>,
    bookmark: Bookmark
  ) => Promise<void>;

};

export const useBookmarkStore = create<State>((set, get) => ({
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

  deleteBookmark: async (
    getToken: () => Promise<string | null>,
    bookmark: Bookmark
  ) => {
    const prev = get().bookmarks;
    set({ bookmarks: prev.filter((b) => b.id !== bookmark.id) }); // optimistic
    try {
      await deleteBookmarkApi(getToken, bookmark.id);
    } catch {
      set({ bookmarks: prev }); // roll back on failure
    }
  },

  
}));

