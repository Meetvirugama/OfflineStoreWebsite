import { create } from "zustand";
import apiClient from "@core/api/client";

const useNewsStore = create((set) => ({
  news: [],
  loading: false,
  error: null,

  fetchNews: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get("/news", { params });
      // apiClient interceptor returns response.data = { success, message, data: [...] }
      const articles = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      set({ news: articles, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  sync: async () => {
    set({ loading: true });
    try {
      await apiClient.post("/news/sync");
      const res = await apiClient.get("/news");
      const articles = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      set({ news: articles, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  }
}));

export default useNewsStore;
