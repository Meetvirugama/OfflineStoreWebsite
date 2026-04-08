import { create } from "zustand";
import apiClient from "@core/api/client";

const useFarmerStore = create((set, get) => ({
    savedCrops: [],
    profitStats: null,
    loading: false,

    fetchDashboardData: async () => {
        set({ loading: true });
        try {
            const [cropsRes, profitRes] = await Promise.all([
                apiClient.get("/dashboard/stats"), // Unified stats endpoint or specific ones
                apiClient.get("/profit/stats")
            ]);
            
            set({
                savedCrops: cropsRes.data || [],
                profitStats: profitRes.data || null,
                loading: false
            });
        } catch {
            set({ loading: false });
        }
    }
}));

export default useFarmerStore;
