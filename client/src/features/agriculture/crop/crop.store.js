import { create } from "zustand";
import apiClient from "@core/api/client";

const useCropStore = create((set) => ({
    selectedCrop: null,
    trends: [],
    recommendation: null,
    loading: false,
    error: null,

    fetchCropInfo: async (name) => {
        set({ loading: true, error: null });
        try {
            const data = await apiClient.get(`/crops/${name}`);
            set({ selectedCrop: data.crop, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchRecommendation: async (name) => {
        set({ loading: true });
        try {
            const data = await apiClient.get(`/crops/${name}/recommendation`);
            set({ recommendation: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    }
}));

export default useCropStore;
