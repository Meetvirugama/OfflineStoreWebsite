import { create } from "zustand";
import apiClient from "@core/api/client";

const useMandiStore = create((set, get) => ({
    prices: [],
    loading: false,
    filters: {
        state: "Gujarat",
        district: "",
        commodity: "",
    },
    summary: null,
    cropTrends: [],
    districtTrends: [],
    bestMandi: null,
    trends: [],
    trendsLoading: false,
    totalCount: 0,
    page: 1,
    setPage: (page) => set({ page }),

    setFilters: (newFilters) => set((state) => ({ 
        filters: { ...state.filters, ...newFilters }
    })),

    fetchPrices: async () => {
        set({ loading: true });
        try {
            const { state, district, commodity } = get().filters;
            const res = await apiClient.get("/mandi/prices", { 
                params: { state, district, crop: commodity } 
            });
            set({ prices: Array.isArray(res) ? res : [], loading: false });
        } catch (err) {
            set({ loading: false });
        }
    },

    fetchSummary: async () => {
        try {
            const res = await apiClient.get("/mandi/summary");
            set({ summary: res || null });
        } catch (err) {
            console.error("Fetch summary error:", err);
        }
    },

    fetchCropTrends: async (crop, days = 30) => {
        try {
            const state = get().filters.state;
            const res = await apiClient.get("/mandi/trends", { 
                params: { crop, district: "all", days, state } 
            });
            set({ cropTrends: Array.isArray(res) ? res : [] });
        } catch (err) {
            console.error("Fetch crop trends error:", err);
        }
    },

    fetchBestMandi: async (crop) => {
        try {
            const res = await apiClient.get("/mandi/best-mandi", { params: { crop } });
            set({ bestMandi: res || null });
        } catch (err) {
            console.error("Fetch best mandi error:", err);
        }
    },

    fetchMultiCropTrends: async (crops, days = 30) => {
        try {
            const state = get().filters.state;
            const res = await apiClient.get("/mandi/trends/multi", { params: { crops, days, state } });
            return Array.isArray(res) ? res : [];
        } catch (err) {
            console.error("Fetch multi trends error:", err);
            return [];
        }
    },

    fetchDistrictTrends: async (crop) => {
        try {
            const state = get().filters.state;
            // Reusing prices logic to get current district comparisons
            const res = await apiClient.get("/mandi/prices", { params: { crop, state } });
            const data = Array.isArray(res) ? res : [];
            
            // Group by district
            const districtMap = {};
            data.forEach(r => {
                if (!districtMap[r.district]) districtMap[r.district] = { sum: 0, count: 0 };
                districtMap[r.district].sum += parseFloat(r.modal_price) || 0;
                districtMap[r.district].count += 1;
            });

            const trends = Object.entries(districtMap).map(([district, stats]) => ({
                district,
                avg_price: Math.round(stats.sum / stats.count)
            }));

            set({ districtTrends: trends });
        } catch (err) {
            console.error("Fetch district trends error:", err);
        }
    },

    fetchTrends: async (crop, district, days = 30) => {
        set({ trendsLoading: true });
        try {
            const state = get().filters.state;
            const res = await apiClient.get("/mandi/trends", { 
                params: { crop, district, days, state } 
            });
            const trendData = Array.isArray(res) ? res : [];
            set({ trends: trendData, trendsLoading: false });
        } catch (err) {
            set({ trendsLoading: false, trends: [] });
        }
    },

    fetchNearby: async (lat, lng) => {
        set({ loading: true });
        try {
            const data = await apiClient.get("/mandi/nearby", { params: { lat, lng } });
            set({ loading: false });
            return data;
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    }
}));

export default useMandiStore;
