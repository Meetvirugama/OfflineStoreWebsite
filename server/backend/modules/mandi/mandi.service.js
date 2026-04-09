import axios from "axios";
import MandiPrice from "./mandi.model.js";
import { ENV } from "../../config/env.js";

/**
 * Fetch nearby Mandis from Google Places
 */
export const getNearbyMandis = async (lat, lon, radius = 50000) => {
    if (!ENV.GOOGLE_PLACES_KEY) {
        console.warn("GOOGLE_PLACES_KEY missing. Returning precision fallback data.");
        return [
            { id: "mock-1", name: "Gondal APMC Mandi", address: "Gondal, Gujarat", location: { lat: 21.96, lng: 70.80 } },
            { id: "mock-2", name: "Rajkot Marketing Yard", address: "Rajkot, Gujarat", location: { lat: 22.30, lng: 70.80 } },
            { id: "mock-3", name: "Unjha Spice Mandi", address: "Unjha, North Gujarat", location: { lat: 23.81, lng: 72.39 } }
        ];
    }

    try {
        const keyword = "mandi|APMC|agricultural market";
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
        
        const response = await axios.get(url, {
            params: {
                location: `${lat},${lon}`,
                radius: radius,
                keyword: keyword,
                key: ENV.GOOGLE_PLACES_KEY
            }
        });

        return (response.data.results || []).map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            location: place.geometry.location
        }));
    } catch (err) {
        console.error("Geocoding Error:", err);
        return [];
    }
};

/**
 * Get internal price analysis from DB
 */
export const getPriceStats = async (commodity) => {
    return await MandiPrice.findAll({
        where: { commodity },
        order: [["arrival_date", "DESC"]],
        limit: 10
    });
};

/**
 * Fetch Live Mandi Prices from data.gov.in
 */
export const getLiveMandiPrices = async (filters = {}) => {
    const { state, district, crop } = filters;
    const API_KEY = ENV.DATA_GOV_KEY;
    const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

    if (!API_KEY) {
        console.warn("DATA_GOV_API_KEY missing. Returning mock price data.");
        return [
            { state: "Gujarat", district: "Ahmedabad", market: "Ahmedabad", commodity: crop || "Wheat", min_price: "2200", max_price: "2500", modal_price: "2400", arrival_date: new Date().toISOString() },
            { state: "Gujarat", district: "Gondal", market: "Gondal", commodity: crop || "Wheat", min_price: "2300", max_price: "2600", modal_price: "2450", arrival_date: new Date().toISOString() }
        ];
    }

    try {
        const params = {
            "api-key": API_KEY,
            format: "json",
            limit: 100
        };

        if (state) params["filters[state]"] = state;
        if (district) params["filters[district]"] = district;
        if (crop) params["filters[commodity]"] = crop;

        console.log("📡 Fetching Live Mandi Prices from data.gov.in...");
        const response = await axios.get(`https://api.data.gov.in/resource/${RESOURCE_ID}`, { params });

        return response.data.records || [];
    } catch (err) {
        console.error("Data.gov.in API Error:", err.message);
        throw new Error("Failed to fetch live mandi prices");
    }
};

/**
 * Get Agri Intelligence Dashboard Stats from Live Data
 */
export const getAgriDashboardStats = async () => {
    const API_KEY = ENV.DATA_GOV_KEY;
    const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

    if (!API_KEY) return null;

    try {
        const response = await axios.get(`https://api.data.gov.in/resource/${RESOURCE_ID}`, {
            params: {
                "api-key": API_KEY,
                format: "json",
                limit: 200, // Fetch enough for meaningful trends
                sort: "arrival_date desc"
            }
        });

        const records = response.data.records || [];
        if (records.length === 0) return null;

        // 1. Top Crops by Volume (Frequency in arrival records)
        const cropCounts = {};
        records.forEach(r => {
            cropCounts[r.commodity] = (cropCounts[r.commodity] || 0) + 1;
        });
        const topCrops = Object.entries(cropCounts)
            .map(([commodity, volume]) => ({ commodity, volume }))
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 5);

        // 2. Price Trends (Daily Average Modal Price)
        const dailyPrices = {};
        records.forEach(r => {
            const date = new Date(r.arrival_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            if (!dailyPrices[date]) dailyPrices[date] = { sum: 0, count: 0 };
            dailyPrices[date].sum += parseFloat(r.modal_price) || 0;
            dailyPrices[date].count += 1;
        });
        const trends = Object.entries(dailyPrices)
            .map(([date, stats]) => ({ date, avg_price: Math.round(stats.sum / stats.count) }))
            .sort((a,b) => new Date(a.date) - new Date(b.date))
            .slice(-7);

        // 3. Demand/Category Insights (Simplified mapping)
        const demand = [
            { category: "Grains", movement: records.filter(r => ["Wheat", "Paddy", "Bajra"].includes(r.commodity)).length },
            { category: "Vegetables", movement: records.filter(r => ["Onion", "Tomato", "Potato"].includes(r.commodity)).length },
            { category: "Oilseeds", movement: records.filter(r => ["Mustard", "Soyabean", "Groundnut"].includes(r.commodity)).length }
        ].filter(d => d.movement > 0);

        return { topCrops, trends, demand };
    } catch (err) {
        console.error("Agri Stats Error:", err.message);
        return null;
    }
};

/**
 * Get Historical Price Trends for a specific Crop & District
 */
export const getHistoricalMandiTrends = async (commodity, district, days = 30) => {
    const API_KEY = ENV.DATA_GOV_KEY;
    const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

    if (!API_KEY) return [];

    try {
        console.log(`📡 Fetching Historical Trends for ${commodity} in ${district} (${days} days)...`);
        
        const params = {
            "api-key": API_KEY,
            format: "json",
            limit: 500, // Large enough sample size
            sort: "arrival_date desc",
            "filters[commodity]": commodity,
            "filters[district]": district
        };

        const response = await axios.get(`https://api.data.gov.in/resource/${RESOURCE_ID}`, { params });
        const records = response.data.records || [];

        // Process and group by date (in case of multiple markets in same district)
        const dateMap = {};
        records.forEach(r => {
            const dateStr = new Date(r.arrival_date).toISOString().split('T')[0];
            if (!dateMap[dateStr]) {
                dateMap[dateStr] = { date: dateStr, modal: 0, count: 0, min: 999999, max: 0 };
            }
            dateMap[dateStr].modal += parseFloat(r.modal_price) || 0;
            dateMap[dateStr].count += 1;
            dateMap[dateStr].min = Math.min(dateMap[dateStr].min, parseFloat(r.min_price) || 999999);
            dateMap[dateStr].max = Math.max(dateMap[dateStr].max, parseFloat(r.max_price) || 0);
        });

        const trends = Object.values(dateMap)
            .map(d => ({
                date: new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                modal: Math.round(d.modal / d.count),
                min: d.min === 999999 ? 0 : d.min,
                max: d.max
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-days); // Limit to requested days count

        return trends;
    } catch (err) {
        console.error("Historical Trends Error:", err.message);
        return [];
    }
};

/**
 * Search Mandis via Text
 */
export const searchMandis = async (query) => {
    if (!ENV.GOOGLE_PLACES_KEY) return [];
    
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
    const response = await axios.get(url, {
        params: {
            query: `${query} APMC Mandi`,
            key: ENV.GOOGLE_PLACES_KEY
        }
    });

    return (response.data.results || []).map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        location: place.geometry.location
    }));
};
