import { create } from "zustand";
import apiClient from "../../../../core/api/client.js";

const useWeatherStore = create((set, get) => ({
    currentWeather: null,
    forecast: null,
    insights: [],
    loading: false,
    error: null,

    fetchCurrentWeather: async (lat, lon) => {
        set({ loading: true, error: null });
        try {
            const params = lat && lon ? { lat, lon } : {};
            const data = await apiClient.get("/weather/current", { params });
            set({ 
                currentWeather: data.current, 
                insights: data.insights,
                loading: false 
            });
            return data;
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchForecast: async (lat, lon) => {
        set({ loading: true });
        try {
            const data = await apiClient.get("/weather/forecast", { params: { lat, lon } });
            set({ forecast: data.forecast, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    }
}));

export default useWeatherStore;
