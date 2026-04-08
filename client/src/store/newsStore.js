import { create } from 'zustand';
import * as newsApi from '../services/newsApi';

export const useNewsStore = create((set) => ({
  news: [],
  loading: false,
  error: null,

  fetchNews: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await newsApi.getFarmingNews(filters);
      set({ news: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  syncNews: async () => {
    set({ loading: true });
    try {
      await newsApi.syncNews();
      const data = await newsApi.getFarmingNews();
      set({ news: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));
