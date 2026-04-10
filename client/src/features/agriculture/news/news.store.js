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
      // interceptor auto-flattens: res is the articles array directly
      set({ news: Array.isArray(res) ? res : [], loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  sync: async () => {
    set({ loading: true });
    try {
      await apiClient.post("/news/sync");
      const res = await apiClient.get("/news");
      set({ news: Array.isArray(res) ? res : [], loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  }
}));

export default useNewsStore;
