import { create } from "zustand";
import apiClient from "@core/api/client";

const useWeatherStore = create((set, get) => ({
    currentWeather: null,
    todayTimeline: [],
    extendedForecast: [],
    alerts: [],
    indices: null,
    loading: false,
    error: null,
    selectedLocation: (() => {
        try {
            const saved = localStorage.getItem("agromart_location");
            return saved && saved !== "undefined" ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Failed to parse saved location:", e);
            return null;
        }
    })(),

    initialize: async () => {
        const saved = get().selectedLocation;
        await get().fetchAtmosphericDetails(saved?.lat, saved?.lon);
    },

    fetchAtmosphericDetails: async (lat, lon) => {
        set({ loading: true, error: null });
        try {
            const params = lat && lon ? { lat, lon } : {};
            const res = await apiClient.get("/weather/details", { params });
            // apiClient interceptor returns response.data directly
            const data = (res?.data ?? res) || {};
            
            set({ 
                currentWeather: data.current,
                todayTimeline: data.todayTimeline || [],
                extendedForecast: data.extendedForecast || [],
                alerts: data.alerts || [],
                indices: data.indices || null,
                loading: false 
            });
            
            return res;
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    searchLocations: async (query) => {
        try {
            const res = await apiClient.get("/weather/search", { params: { q: query } });
            // apiClient interceptor returns response.data directly
            const payload = res?.data ?? res;
            return payload?.locations || [];
        } catch (err) {
            console.error("Search error:", err);
            return [];
        }
    },

    setSelectedLocation: (location) => {
        set({ selectedLocation: location });
        if (location) {
            localStorage.setItem("agromart_location", JSON.stringify(location));
            get().fetchAtmosphericDetails(location.lat, location.lon);
            window.dispatchEvent(new CustomEvent('agromart_location_changed', { detail: location }));
        }
    }
}));

export default useWeatherStore;
