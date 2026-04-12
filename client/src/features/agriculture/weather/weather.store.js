import { create } from "zustand";
import apiClient from "@core/api/client";

const useWeatherStore = create((set, get) => ({
    currentWeather: null,
    todayTimeline: [],
    extendedForecast: [],
    alerts: [],
    indices: null,
    strategic_outlook: "",
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
        if (saved) {
            await get().fetchAtmosphericDetails(saved.lat, saved.lon);
        } else {
            // Attempt Auto-Location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        const location = await get().reverseGeocode(latitude, longitude);
                        if (location) {
                            get().setSelectedLocation(location);
                        } else {
                            // Fallback if geocoding fails
                            await get().fetchAtmosphericDetails(); 
                        }
                    },
                    async (error) => {
                        console.error("Geolocation denied or failed:", error);
                        await get().fetchAtmosphericDetails(); // Fallback to Surat
                    }
                );
            } else {
                await get().fetchAtmosphericDetails();
            }
        }
    },

    fetchAtmosphericDetails: async (lat, lon) => {
        set({ loading: true, error: null });
        try {
            const params = lat && lon ? { lat, lon } : {};
            const res = await apiClient.get("/weather/details", { params });
            const data = res || {};
            
            set({ 
                currentWeather: data.current || null,
                todayTimeline: data.todayTimeline || [],
                extendedForecast: data.extendedForecast || [],
                alerts: data.alerts || [],
                indices: data.indices || null,
                strategic_outlook: data.strategic_outlook || "",
                loading: false 
            });
            
            return res;
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    reverseGeocode: async (lat, lon) => {
        try {
            const res = await apiClient.get("/weather/reverse", { params: { lat, lon } });
            return res?.location || null;
        } catch (err) {
            console.error("Reverse geocoding error:", err);
            return null;
        }
    },

    searchLocations: async (query) => {
        try {
            const res = await apiClient.get("/weather/search", { params: { q: query } });
            return (res?.locations) || [];
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
