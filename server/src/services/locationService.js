import axios from "axios";
import { UserLocation } from "../models/index.js";

const API_KEY = process.env.WEATHER_API_KEY;

// OSM Custom User-Agent for compliance
const OSM_HEADERS = { "User-Agent": "AgroMartERP/1.0 (meetvirugama4902@gmail.com)" };

/**
 * GEOCODING (SEARCH BY NAME)
 * ENGINE 1: OpenWeather (Primary)
 * ENGINE 2: OpenStreetMap (Fallback for villages)
 */
export const searchLocation = async (query) => {
    try {
        // --- TRIP 1: OPENWEATHER ---
        console.log(`🌐 [Engine-1] Searching OpenWeather API: ${query}`);
        const owRes = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
            params: { q: `${query}, IN`, limit: 5, appid: API_KEY }
        });

        if (owRes.data && owRes.data.length > 0) {
            console.log(`✅ Result found via OpenWeather`);
            return owRes.data.map(loc => ({
                name: `${loc.name}, ${loc.state ? loc.state + ', ' : ''}${loc.country}`,
                lat: loc.lat,
                lon: loc.lon,
                city: loc.name,
                state: loc.state,
                source: 'openweather'
            }));
        }

        // --- TRIP 2: OPENSTREETMAP (FALLBACK) ---
        console.log(`🔍 [Engine-2] OpenWeather found nothing. Falling back to OSM: ${query}`);
        const osmRes = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: { q: `${query}, Gujarat, India`, format: 'json', limit: 5 },
            headers: OSM_HEADERS
        });

        if (osmRes.data && osmRes.data.length > 0) {
            console.log(`✅ Result found via OpenStreetMap`);
            return osmRes.data.map(loc => ({
                name: loc.display_name,
                lat: parseFloat(loc.lat),
                lon: parseFloat(loc.lon),
                city: loc.name || query,
                state: "Gujarat",
                source: 'osm'
            }));
        }

        console.warn(`⚠️ No matches found in either global API for: ${query}`);
        return [];
    } catch (err) {
        console.error("❌ Geocoding System Failure:", err.response?.data || err.message);
        return [];
    }
};

/**
 * REVERSE GEOCODING (COORD TO NAME)
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
 * IP-BASED LOCATION
 */
export const getIPLocation = async (ip) => {
    try {
        const res = await axios.get(`https://ipapi.co/${ip}/json/`);
        return {
            city: res.data.city,
            state: res.data.region,
            country: res.data.country_name,
            lat: res.data.latitude,
            lon: res.data.longitude
        };
    } catch (err) {
        return { city: "Rajkot", state: "Gujarat", lat: 22.3072, lon: 70.8022 };
    }
};

/**
 * USER SAVED LOCATIONS
 */
export const saveUserLocation = async (userId, locationData) => {
    const { name, lat, lon, is_default, village, city, state } = locationData;
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
