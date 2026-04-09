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
 * Search Mandis via Text
 */
export const searchMandis = async (query) => {
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
