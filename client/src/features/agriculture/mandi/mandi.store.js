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
            // Handle standardized { success, data } response
            const priceData = res.data || res || [];
            set({ prices: priceData, loading: false });
        } catch (err) {
            set({ loading: false });
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
