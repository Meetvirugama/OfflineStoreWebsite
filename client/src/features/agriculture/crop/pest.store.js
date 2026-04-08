import { create } from "zustand";
import apiClient from "../../../../core/api/client.js";

const usePestStore = create((set, get) => ({
    history: [],
    loading: false,
    currentDetection: null,

    detect: async (formData) => {
        set({ loading: true });
        try {
            const data = await apiClient.post("/crops/detect-pest", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            set({ currentDetection: data, loading: false });
            get().fetchHistory();
            return data;
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    fetchHistory: async () => {
        try {
            const data = await apiClient.get("/crops/pest-history");
            set({ history: data });
        } catch {}
    }
}));

export default usePestStore;
