import { create } from "zustand";
import axiosInstance from "../services/axiosInstance";

const useAdvisoryStore = create((set, get) => ({
    curAdvisory: null,
    history: [],
    loading: false,
    error: null,

    generateAdvisory: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.post("/advisory/generate", data);
            set({ curAdvisory: res.data, loading: false });
            get().fetchHistory(); // Refresh history
            return res.data;
        } catch (err) {
            set({ error: err.response?.data?.error || err.message, loading: false });
            throw err;
        }
    },

    fetchHistory: async (crop = "") => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get(`/advisory/history${crop ? '?crop='+crop : ''}`);
            set({ history: res.data, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.error || err.message, loading: false });
        }
    },

    clearCurrent: () => set({ curAdvisory: null, error: null })
}));

export default useAdvisoryStore;
