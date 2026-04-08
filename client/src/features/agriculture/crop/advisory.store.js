import { create } from "zustand";
import apiClient from "@core/api/client";

const useAdvisoryStore = create((set, get) => ({
    curAdvisory: null,
    history: [],
    loading: false,
    error: null,

    generateAdvisory: async (formData) => {
        set({ loading: true, error: null });
        try {
            const data = await apiClient.post("/crops/advisory", formData);
            set({ curAdvisory: data, loading: false });
            // Refresh history after new generation
            await get().fetchHistory();
            return data;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    fetchHistory: async () => {
        set({ loading: true });
        try {
            const data = await apiClient.get("/crops/advisory/history");
            set({ history: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    clearCurrent: () => {
        set({ curAdvisory: null });
    }
}));

export default useAdvisoryStore;
