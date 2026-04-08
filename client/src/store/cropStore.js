import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const useCropStore = create((set) => ({
    crops: [],
    selectedCrop: null,
    trends: [],
    recommendation: null,
    seasonal: null,
    aiAnalysis: null,
    loading: false,
    error: null,

    fetchCropInfo: async (name) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/crops/${name}`);
            set({ selectedCrop: res.data.crop, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to fetch crop info', loading: false });
        }
    },

    fetchCropTrends: async (name, days = 30) => {
        set({ loading: true });
        try {
            const res = await axios.get(`${API_URL}/crops/${name}/trends?days=${days}`);
            set({ trends: res.data.prices, loading: false });
        } catch (err) {
            set({ error: 'Failed to fetch trends', loading: false });
        }
    },

    fetchRecommendation: async (name) => {
        set({ loading: true });
        try {
            const res = await axios.get(`${API_URL}/crops/${name}/recommendation`);
            set({ recommendation: res.data, loading: false });
        } catch (err) {
            set({ error: 'Failed to fetch recommendations', loading: false });
        }
    },

    fetchSeasonalSuggestions: async () => {
        try {
            const res = await axios.get(`${API_URL}/crops/suggestions/seasonal`);
            set({ seasonal: res.data });
        } catch (err) {
            console.error('Failed to fetch seasonal suggestions');
        }
    },

    fetchAIInsights: async (name) => {
        try {
            const res = await axios.get(`${API_URL}/crops/${name}/ai-insights`);
            set({ aiAnalysis: res.data });
        } catch (err) {
            console.error('Failed to fetch AI insights');
        }
    }
}));
