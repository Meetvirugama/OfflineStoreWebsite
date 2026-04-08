import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const useWeatherStore = create((set, get) => ({
    currentWeather: null,
    forecast: null,
    insights: [],
    savedLocations: [],
    selectedLocation: null,
    loading: false,
    error: null,

    fetchCurrentWeather: async (lat, lon) => {
        set({ loading: true, error: null });
        try {
            const params = lat && lon ? { lat, lon } : {};
            const res = await axios.get(`${API_URL}/weather/current`, { params });
            set({ 
                currentWeather: res.data.current, 
                insights: res.data.insights,
                loading: false 
            });
            return res.data;
        } catch (err) {
            set({ error: 'Failed to fetch weather data', loading: false });
        }
    },

    fetchForecast: async (lat, lon) => {
        set({ loading: true });
        try {
            const res = await axios.get(`${API_URL}/weather/forecast`, { params: { lat, lon } });
            set({ forecast: res.data.forecast, loading: false });
        } catch (err) {
            set({ error: 'Failed to fetch forecast', loading: false });
        }
    },

    searchLocations: async (query) => {
        try {
            const res = await axios.get(`${API_URL}/weather/by-city`, { params: { name: query } });
            return res.data.results;
        } catch (err) {
            console.error('Search failed');
            return [];
        }
    },

    saveLocation: async (locationData) => {
        try {
            const res = await axios.post(`${API_URL}/locations`, locationData, { withCredentials: true });
            set(state => ({ savedLocations: [...state.savedLocations, res.data.location] }));
        } catch (err) {
            console.error('Failed to save location');
        }
    },

    fetchSavedLocations: async () => {
        try {
            const res = await axios.get(`${API_URL}/locations`, { withCredentials: true });
            set({ savedLocations: res.data.locations });
            // Set default location as selected if exists
            const def = res.data.locations.find(l => l.is_default);
            if (def) set({ selectedLocation: def });
        } catch (err) {
            console.error('Failed to fetch locations');
        }
    },

    setSelectedLocation: (loc) => {
        set({ selectedLocation: loc });
        if (loc) {
            get().fetchCurrentWeather(loc.lat, loc.lon);
            get().fetchForecast(loc.lat, loc.lon);
        }
    }
}));
