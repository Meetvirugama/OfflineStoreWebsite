import { getCurrentWeather, getForecast, getFarmingInsights } from "../services/weatherService.js";
import { getIPLocation, searchLocation } from "../services/locationService.js";

/**
 * GET CURRENT WEATHER
 */
export const getWeather = async (req, res) => {
    try {
        let { lat, lon } = req.query;
        
        // IP Fallback if no lat/lon provided
        if (!lat || !lon) {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const ipLoc = await getIPLocation(ip);
            lat = ipLoc.lat;
            lon = ipLoc.lon;
        }

        const current = await getCurrentWeather(lat, lon);
        const insights = getFarmingInsights(current);
        
        res.json({ success: true, current, insights });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET FORECAST (48H / 7D)
 */
export const getWeatherForecast = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) throw new Error("Latitude and Longitude are required");

        const forecast = await getForecast(lat, lon);
        res.json({ success: true, forecast });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * SEARCH BY CITY
 */
export const searchByCity = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) throw new Error("City name query is required");

        const results = await searchLocation(name);
        res.json({ success: true, results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
