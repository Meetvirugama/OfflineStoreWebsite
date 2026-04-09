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
