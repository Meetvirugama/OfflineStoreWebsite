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

/**
 * TRANSFORMATION UTILITY: 5-Day Forecast -> OneCall Mock
 * Ensures frontend doesn't crash on free-tier keys
 */
const transform5DayToOneCall = (fiveDayData) => {
    const list = fiveDayData.list || [];
    
    // 1. Map Hourly (next 24-48 hours)
    const hourly = list.slice(0, 16).map(item => ({
        dt: item.dt,
        temp: item.main.temp,
        main: {
            temp: item.main.temp,
            temp_min: item.main.temp_min,
            temp_max: item.main.temp_max,
            humidity: item.main.humidity
        },
        humidity: item.main.humidity,
        weather: item.weather,
        pop: item.pop || 0
    }));

    // 2. Map Daily (Aggregate by day)
    const dailyMap = {};
    list.forEach(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyMap[date]) {
            dailyMap[date] = {
                dt: item.dt,
                temp: { day: item.main.temp, min: item.main.temp, max: item.main.temp },
                humidity: item.main.humidity,
                weather: item.weather,
                summary: item.weather[0].description
            };
        } else {
            dailyMap[date].temp.min = Math.min(dailyMap[date].temp.min, item.main.temp);
            dailyMap[date].temp.max = Math.max(dailyMap[date].temp.max, item.main.temp);
        }
    });

    return {
        lat: fiveDayData.city?.coord?.lat,
        lon: fiveDayData.city?.coord?.lon,
        timezone: "Asia/Kolkata",
        current: hourly[0],
        hourly,
        daily: Object.values(dailyMap).slice(0, 8)
    };
};

export const getForecast = async (lat, lon) => {
    try {
        const cached = await getCachedWeather(lat, lon, "forecast");
        if (cached) return cached;

        try {
            // Attempt OneCall 3.0 (Paid/Subscription required)
            const res = await axios.get(ONE_CALL_URL, {
                params: { lat, lon, exclude: "minutely", appid: API_KEY, units: "metric" }
            });
            await saveToCache(lat, lon, "forecast", res.data, 30);
            return res.data;
        } catch (oneCallErr) {
            console.warn("⚠️ OneCall API failed (likely free key). Using 5-day transformer fallback.");
            
            const res = await axios.get(`${BASE_URL}/forecast`, {
                params: { lat, lon, appid: API_KEY, units: "metric" }
            });
            
            const transformed = transform5DayToOneCall(res.data);
            await saveToCache(lat, lon, "forecast", transformed, 30);
            return transformed;
        }
    } catch (err) {
        console.error("❌ Weather Service Error (Forecast):", err.message);
        throw err;
    }
};

export const getFarmingInsights = (weatherData) => {
    const insights = [];
    const temp = weatherData.main?.temp || weatherData.current?.temp || (weatherData.temp?.day);
    const humidity = weatherData.main?.humidity || weatherData.current?.humidity || weatherData.humidity;
    const weather = (weatherData.weather?.[0]?.main || "").toLowerCase();

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
        
        const temp = weather.main?.temp || weather.current?.temp;
        const condition = weather.weather?.[0]?.main || "Clear";

        let recommendation = "Ideal conditions for growth. Ensure regular monitoring.";
        if (temp > 30) recommendation = `High heat detected for ${cropName}. Monitor soil moisture closely.`;
        if (condition === 'Rain') recommendation = `${cropName} needs drainage check due to active rainfall.`;

        return {
            crop: cropName,
            recommendation,
            weather: {
                temperature: temp,
                humidity: weather.main?.humidity || weather.current?.humidity,
                condition: condition
            },
            insights
        };
    } catch (err) {
        console.error("❌ Recommendation Error:", err.message);
        throw err;
    }
};
