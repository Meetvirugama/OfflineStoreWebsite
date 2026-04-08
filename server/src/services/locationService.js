import axios from "axios";
import { UserLocation } from "../models/index.js";

const API_KEY = process.env.WEATHER_API_KEY || "YOUR_OPENWEATHER_API_KEY";

/**
 * IP-BASED LOCATION (BACKEND FALLBACK)
 */
export const getIPLocation = async (ip) => {
    try {
        // Using ipapi.co (Free tier allows 1000 requests/day)
        const res = await axios.get(`https://ipapi.co/${ip}/json/`);
        return {
            city: res.data.city,
            state: res.data.region,
            country: res.data.country_name,
            lat: res.data.latitude,
            lon: res.data.longitude
        };
    } catch (err) {
        console.error("❌ IP Location Error:", err.message);
        // Fallback to a default (e.g., center of India)
        return { city: "Rajkot", state: "Gujarat", lat: 22.3072, lon: 70.8022 };
    }
};

/**
 * REVERSE GEOCODING
 */
export const reverseGeocode = async (lat, lon) => {
    try {
        const res = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse`, {
            params: { lat, lon, limit: 1, appid: API_KEY }
        });
        
        if (res.data.length > 0) {
            const loc = res.data[0];
            return {
                village: loc.name,
                city: loc.local_names?.en || loc.name,
                state: loc.state
            };
        }
        return null;
    } catch (err) {
        console.error("❌ Reverse Geocode Error:", err.message);
        return null;
    }
};

/**
 * GEOCODING (SEARCH BY CITY)
 */
export const searchLocation = async (query) => {
    try {
        const res = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
            params: { q: query, limit: 5, appid: API_KEY }
        });
        return res.data.map(loc => ({
            name: `${loc.name}, ${loc.state ? loc.state + ', ' : ''}${loc.country}`,
            lat: loc.lat,
            lon: loc.lon,
            city: loc.name,
            state: loc.state
        }));
    } catch (err) {
        console.error("❌ Search Location Error:", err.message);
        throw err;
    }
};

/**
 * USER LOCATION MANAGEMENT
 */
export const saveUserLocation = async (userId, locationData) => {
    const { name, lat, lon, is_default, village, city, state } = locationData;
    
    // If setting as default, unset others
    if (is_default) {
        await UserLocation.update({ is_default: false }, { where: { user_id: userId } });
    }
    
    const count = await UserLocation.count({ where: { user_id: userId } });
    
    return await UserLocation.create({
        user_id: userId,
        name,
        lat,
        lon,
        is_default: count === 0 ? true : is_default,
        village,
        city,
        state
    });
};

export const listUserLocations = async (userId) => {
    return await UserLocation.findAll({ where: { user_id: userId }, order: [['is_default', 'DESC'], ['created_at', 'DESC']] });
};

export const setDefaultLocation = async (userId, locationId) => {
    await UserLocation.update({ is_default: false }, { where: { user_id: userId } });
    return await UserLocation.update({ is_default: true }, { where: { id: locationId, user_id: userId } });
};
