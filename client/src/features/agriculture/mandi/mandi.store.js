import { create } from "zustand";
import apiClient from "@core/api/client";

const useMandiStore = create((set, get) => ({
    prices: [],
    loading: false,
    filters: {
        state: "Gujarat",
        district: "",
        commodity: "",
        date: "",
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
            const { state, district, commodity, date } = get().filters;
            const page = get().page;
            const res = await apiClient.get("/mandi/prices", { 
                params: { state, district, crop: commodity, date, page, limit: 20 } 
            });
            
            // Normalize: Convert per quintal (100kg) to per kg
            const normalizedRecords = (res.records || []).map(r => ({
                ...r,
                min_price: r.min_price ? (r.min_price / 100).toFixed(2) : 0,
                max_price: r.max_price ? (r.max_price / 100).toFixed(2) : 0,
                modal_price: r.modal_price ? (r.modal_price / 100).toFixed(2) : 0
            }));

            set({ 
                prices: normalizedRecords, 
                totalCount: res.totalCount || 0,
                loading: false 
            });
        } catch (err) {
            set({ loading: false });
        }
    },

    fetchSummary: async () => {
        try {
            const res = await apiClient.get("/mandi/summary");
            // Normalize: Convert per quintal (100kg) to per kg
            if (res && res.highestPrice) {
                res.highestPrice = (res.highestPrice / 100).toFixed(2);
            }
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
            
            // Normalize: Convert per quintal (100kg) to per kg
            const normalizedTrends = (res || []).map(t => ({
                ...t,
                min: t.min ? (t.min / 100).toFixed(2) : 0,
                max: t.max ? (t.max / 100).toFixed(2) : 0,
                modal: t.modal ? (t.modal / 100).toFixed(2) : 0
            }));

            set({ cropTrends: normalizedTrends });
        } catch (err) {
            console.error("Fetch crop trends error:", err);
        }
    },

    fetchBestMandi: async (crop) => {
        try {
            const res = await apiClient.get("/mandi/best-mandi", { params: { crop } });
            // Normalize: Convert per quintal (100kg) to per kg
            if (res && res.modal_price) {
                res.modal_price = (res.modal_price / 100).toFixed(2);
            }
            set({ bestMandi: res || null });
        } catch (err) {
            console.error("Fetch best mandi error:", err);
        }
    },

    fetchMultiCropTrends: async (crops, days = 30) => {
        try {
            const state = get().filters.state;
            const res = await apiClient.get("/mandi/trends/multi", { params: { crops, days, state } });
            
            // Normalize: Convert per quintal (100kg) to per kg for all crops
            return (res || []).map(point => {
                const normalizedPoint = { ...point };
                Object.keys(point).forEach(key => {
                    if (key !== 'date') {
                        normalizedPoint[key] = point[key] ? (point[key] / 100).toFixed(2) : 0;
                    }
                });
                return normalizedPoint;
            });
        } catch (err) {
            console.error("Fetch multi trends error:", err);
            return [];
        }
    },

    fetchDistrictTrends: async (crop) => {
        try {
            const state = get().filters.state;
            const res = await apiClient.get("/mandi/comparison", { params: { crop, state } });
            
            // Normalize: Convert per quintal (100kg) to per kg
            const normalizedDistrictTrends = (res || []).map(d => ({
                ...d,
                avg_price: d.avg_price ? (d.avg_price / 100).toFixed(2) : 0
            }));

            set({ districtTrends: normalizedDistrictTrends });
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
            
            // Normalize: Convert per quintal (100kg) to per kg
            const normalizedTrends = (res || []).map(t => ({
                ...t,
                modal: t.modal ? (t.modal / 100).toFixed(2) : 0
            }));

            set({ trends: normalizedTrends, trendsLoading: false });
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
