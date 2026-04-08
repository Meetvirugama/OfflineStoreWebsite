import axios from "axios";
import { WeatherCache } from "../models/index.js";
import { Op } from "sequelize";

const API_KEY = process.env.WEATHER_API_KEY || "YOUR_OPENWEATHER_API_KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const ONE_CALL_URL = "https://api.openweathermap.org/data/3.0/onecall";

/**
 * CACHE MANAGER
 */
const getCachedWeather = async (lat, lon, type) => {
    const key = `${type}_${parseFloat(lat).toFixed(2)}_${parseFloat(lon).toFixed(2)}`;
    const now = new Date();
    
    const cached = await WeatherCache.findOne({
        where: {
            lat_lon_key: key,
            expires_at: { [Op.gt]: now }
        }
    });
    
    return cached ? cached.data : null;
};

const saveToCache = async (lat, lon, type, data, ttlMinutes = 10) => {
    const key = `${type}_${parseFloat(lat).toFixed(2)}_${parseFloat(lon).toFixed(2)}`;
    const expires_at = new Date();
    expires_at.setMinutes(expires_at.getMinutes() + ttlMinutes);
    
    await WeatherCache.upsert({
        lat_lon_key: key,
        data,
        expires_at
    });
};

/**
 * CORE SERVICES
 */
export const getCurrentWeather = async (lat, lon) => {
    try {
        const cached = await getCachedWeather(lat, lon, "current");
        if (cached) return cached;

        const res = await axios.get(`${BASE_URL}/weather`, {
            params: { lat, lon, appid: API_KEY, units: "metric" }
        });

        const data = res.data;
        await saveToCache(lat, lon, "current", data);
        return data;
    } catch (err) {
        console.error("❌ Weather Service Error (Current):", err.message);
        throw err;
    }
};

export const getForecast = async (lat, lon) => {
    try {
        const cached = await getCachedWeather(lat, lon, "forecast");
        if (cached) return cached;

        // NOTE: This usually requires OneCall 3.0 API access
        const res = await axios.get(ONE_CALL_URL, {
            params: { lat, lon, exclude: "minutely", appid: API_KEY, units: "metric" }
        });

        const data = res.data;
        await saveToCache(lat, lon, "forecast", data, 30); // Forecast cache for 30m
        return data;
    } catch (err) {
        // Fallback or specific error handling for free tier fallback if needed
        console.warn("⚠️ OneCall API failed, trying 5-day forecast fallback.");
        const res = await axios.get(`${BASE_URL}/forecast`, {
            params: { lat, lon, appid: API_KEY, units: "metric" }
        });
        return res.data;
    }
};

export const getFarmingInsights = (weatherData) => {
    const insights = [];
    const temp = weatherData.main?.temp || weatherData.current?.temp;
    const humidity = weatherData.main?.humidity || weatherData.current?.humidity;
    const weather = weatherData.weather?.[0]?.main?.toLowerCase() || "";

    if (temp > 35) {
        insights.push({
            type: "WARNING",
            title: "Heat Stress Alert",
            message: "High temperatures detected. Increase irrigation frequency to prevent crop wilting."
        });
    }

    if (weather.includes("rain")) {
        insights.push({
            type: "ADVICE",
            title: "Rain Detected",
            message: "Natural rainfall expected. Pause automated irrigation systems to save water."
        });
    }

    if (humidity > 85) {
        insights.push({
            type: "WARNING",
            title: "Pest Risk High",
            message: "High humidity levels favor fungal growth. Inspect crops for early signs of blight."
        });
    }

    if (insights.length === 0) {
        insights.push({
            type: "INFO",
            title: "Optimal Conditions",
            message: "Weather conditions are stable. Good time for fertilizer application."
        });
    }

    return insights;
};

/**
 * WEATHER RECOMMENDATION (CROP-SPECIFIC)
 */
export const getWeatherRecommendation = async (cropName, lat, lon) => {
    try {
        const weather = await getCurrentWeather(lat, lon);
        const insights = getFarmingInsights(weather);
        
        let recommendation = "Ideal conditions for growth. Ensure regular monitoring.";
        if (weather.main.temp > 30) recommendation = `High heat detected for ${cropName}. Monitor soil moisture closely.`;
        if (weather.weather[0].main === 'Rain') recommendation = `${cropName} needs drainage check due to active rainfall.`;

        return {
            crop: cropName,
            recommendation,
            weather: {
                temperature: weather.main.temp,
                humidity: weather.main.humidity,
                condition: weather.weather[0].main
            },
            insights
        };
    } catch (err) {
        console.error("❌ Recommendation Error:", err.message);
        throw err;
    }
};
