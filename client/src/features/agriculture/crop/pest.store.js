import { create } from "zustand";
import apiClient from "@core/api/client";

const usePestStore = create((set, get) => ({
    history: [],
    loading: false,
    currentDetection: null,

    detectPest: async (formData) => {
        set({ loading: true });
        try {
            const res = await apiClient.post("/pest/detect", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            // res is already flattened by interceptor
            set({ currentDetection: res || null, loading: false });
            get().fetchHistory();
            return res;
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    fetchHistory: async () => {
        try {
            const res = await apiClient.get("/pest/history");
            set({ history: Array.isArray(res) ? res : [] });
        } catch {}
    }
}));

export default usePestStore;
