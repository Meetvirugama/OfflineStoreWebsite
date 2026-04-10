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
            const res = await apiClient.post("/crops/advisory", formData);
            // interceptor auto-flattens: res is the advisory object directly
            set({ curAdvisory: res || null, loading: false });
            await get().fetchHistory();
            return res;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    fetchHistory: async () => {
        set({ loading: true });
        try {
            const res = await apiClient.get("/crops/advisory/history");
            // interceptor auto-flattens: res is the array directly
            set({ history: Array.isArray(res) ? res : [], loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    clearCurrent: () => {
        set({ curAdvisory: null });
    }
}));

export default useAdvisoryStore;
