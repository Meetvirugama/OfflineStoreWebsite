import { create } from 'zustand';
import axiosInstance from '../services/axiosInstance';

const usePestStore = create((set, get) => ({
    history: [],
    loading: false,
    error: null,
    currentDetection: null,

    detectPest: async (formData) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post('/pest/detect', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            set({ currentDetection: response.data, loading: false });
            get().fetchHistory(); // Refresh history
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.error || "AI detection failed. Please try again.";
            set({ error: msg, loading: false });
            throw err;
        }
    },

    fetchHistory: async () => {
        try {
            const response = await axiosInstance.get('/pest/history');
            set({ history: response.data });
        } catch (err) {
            console.error("History fetch error:", err);
        }
    },

    clearCurrent: () => set({ currentDetection: null, error: null })
}));

export default usePestStore;
