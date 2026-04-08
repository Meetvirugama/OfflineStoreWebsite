import { create } from "zustand";
import apiClient from "../../../../core/api/client.js";

const useNewsStore = create((set) => ({
  news: [],
  loading: false,

  fetchNews: async (params = {}) => {
    set({ loading: true });
    try {
      const data = await apiClient.get("/news", { params });
      set({ news: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  sync: async () => {
    set({ loading: true });
    try {
      await apiClient.post("/news/sync");
      const data = await apiClient.get("/news");
      set({ news: data, loading: false });
    } catch {
      set({ loading: false });
    }
  }
}));

export default useNewsStore;
