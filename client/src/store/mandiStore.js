import { create } from "zustand";
import api from "../services/axiosInstance";

export const useMandiStore = create((set, get) => ({
    prices: [],
    loading: false,
    totalCount: 0,
    page: 1,
    limit: 20,
    
    // Filters
    filters: {
        state: "Gujarat",
        district: "",
        commodity: "",
        date: ""
    },

    // Dashboard Data
    summary: null,
    cropTrends: [],
    districtTrends: [],
    marketTrends: [],
    bestMandi: null,

    setFilters: (newFilters) => set((state) => ({ 
        filters: { ...state.filters, ...newFilters },
        page: 1 // Reset page on filter change
    })),

    setPage: (page) => set({ page }),

    fetchPrices: async () => {
        const { filters, page, limit } = get();
        try {
            set({ loading: true });
            const res = await api.get("/mandi/prices", { params: { ...filters, page, limit } });
            set({ prices: res.data.rows, totalCount: res.data.count, loading: false });
        } catch (err) {
            console.error("Mandi Price Fetch Error:", err);
            set({ loading: false });
        }
    },

    fetchSummary: async () => {
        try {
            const res = await api.get("/mandi/dashboard");
            set({ summary: res.data });
        } catch (err) {
            console.error("Mandi Summary Error:", err);
        }
    },

    fetchCropTrends: async (commodity, days = 30) => {
        try {
            const res = await api.get("/mandi/trends/crop", { params: { commodity, days } });
            set({ cropTrends: res.data });
        } catch (err) {
            console.error("Mandi Crop Trend Error:", err);
        }
    },

    fetchDistrictTrends: async (commodity) => {
        try {
            const res = await api.get("/mandi/trends/district", { params: { commodity } });
            set({ districtTrends: res.data });
        } catch (err) {
            console.error("Mandi District Trend Error:", err);
        }
    },

    fetchBestMandi: async (commodity) => {
        try {
            const res = await api.get("/mandi/best", { params: { commodity } });
            set({ bestMandi: res.data });
        } catch (err) {
            console.error("Best Mandi Error:", err);
        }
    },

    fetchMultiCropTrends: async (crops, days = 30) => {
        try {
            const res = await api.get("/mandi/trends/multi", { params: { crops, days } });
            return res.data;
        } catch (err) {
            console.error("Multi Crop Trend Error:", err);
        }
    },

    triggerMockSync: async () => {
        try {
            await api.post("/mandi/sync/mock");
        } catch (err) {
            console.error("Mock Sync Error:", err);
        }
    }
}));

export default useMandiStore;
