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
            const data = await apiClient.get("/mandi/prices", { params: get().filters });
            set({ prices: data.rows, loading: false });
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
