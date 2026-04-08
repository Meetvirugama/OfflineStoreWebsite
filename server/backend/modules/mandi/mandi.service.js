import axios from "axios";
import MandiPrice from "./mandi.model.js";
import { ENV } from "../../config/env.js";

/**
 * Fetch nearby Mandis from Google Places
 */
export const getNearbyMandis = async (lat, lon, radius = 50000) => {
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
