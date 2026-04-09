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
    trends: [],
    trendsLoading: false,

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
            const priceData = res.data?.data || res.data || [];
            set({ prices: priceData, loading: false });
        } catch (err) {
            set({ loading: false });
        }
    },

    fetchTrends: async (crop, district, days = 30) => {
        set({ trendsLoading: true });
        try {
            const res = await apiClient.get("/mandi/trends", { 
                params: { crop, district, days } 
            });
            const trendData = res.data?.data || res.data || [];
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
