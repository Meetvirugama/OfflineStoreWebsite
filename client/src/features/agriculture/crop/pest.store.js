import { create } from "zustand";
import apiClient from "@core/api/client";

const usePestStore = create((set, get) => ({
    history: [],
    loading: false,
    error: null,

    detectPest: async (formData) => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.post("/pest/detect", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            set({ currentDetection: res || null, loading: false });
            get().fetchHistory();
            return res;
        } catch (err) {
            set({ loading: false, error: err.message });
            throw err;
        }
    },

    fetchHistory: async () => {
        try {
            const res = await apiClient.get("/pest/history");
            set({ history: Array.isArray(res) ? res : [] });
        } catch (err) {
            console.error("History fetch failed", err);
        }
    }
}));

export default usePestStore;
