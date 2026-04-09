import { create } from "zustand";
import apiClient from "@core/api/client";

const useCropStore = create((set) => ({
    selectedCrop: null,
    crops: [],
    trends: [],
    aiAnalysis: null,
    seasonal: null,
    loading: false,
    error: null,

    fetchCrops: async () => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get("/crops/list");
            set({ crops: res.data || [], loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchCropInfo: async (name) => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get(`/crops/${name}`);
            set({ selectedCrop: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchCropTrends: async (name, days = 30) => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get(`/crops/${name}/trends?days=${days}`);
            set({ trends: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchAIInsights: async (name) => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get(`/crops/${name}/insights`);
            set({ aiAnalysis: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchSeasonalSuggestions: async () => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get(`/crops/seasonal`);
            set({ seasonal: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    }
}));

export default useCropStore;
