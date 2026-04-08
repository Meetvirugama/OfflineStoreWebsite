import axios from "axios";
import { Op } from "sequelize";
import WeatherCache from "./weather.model.js";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Weather code mapper WMO to OpenWeather style
 */
const mapWmoCode = (code) => {
    if (code === 0) return [{ main: "Clear", description: "clear sky", icon: "01d" }];
    if (code <= 3) return [{ main: "Clouds", description: "partly cloudy", icon: "03d" }];
    if (code <= 48) return [{ main: "Fog", description: "foggy", icon: "50d" }];
    if (code <= 67 || (code >= 80 && code <= 82)) return [{ main: "Rain", description: "rain", icon: "10d" }];
    if (code <= 77 || code === 85 || code === 86) return [{ main: "Snow", description: "snow", icon: "13d" }];
    return [{ main: "Thunderstorm", description: "thunderstorm", icon: "11d" }];
};

export const getCurrentWeather = async (lat, lon) => {
    const key = `current_${parseFloat(lat).toFixed(2)}_${parseFloat(lon).toFixed(2)}`;
    
    // 1. Check Cache
    const cached = await WeatherCache.findOne({ 
        where: { lat_lon_key: key, expires_at: { [Op.gt]: new Date() } } 
    });
    if (cached) return cached.data;

    // 2. Fetch from Open-Meteo
    const res = await axios.get(BASE_URL, {
        params: { latitude: lat, longitude: lon, current_weather: true, hourly: "relative_humidity_2m" }
    });

    const current = res.data.current_weather;
    const data = {
        main: { temp: current.temperature, humidity: res.data.hourly.relative_humidity_2m[0] || 50 },
        weather: mapWmoCode(current.weathercode),
        wind: { speed: current.windspeed }
    };

    // 3. Save Cache (30 min)
    await WeatherCache.upsert({
        lat_lon_key: key,
        data,
        expires_at: new Date(Date.now() + 30 * 60 * 1000)
    });

    return data;
};

export const getFarmingInsights = (weatherData) => {
    const insights = [];
    const temp = weatherData.main?.temp;
    const humidity = weatherData.main?.humidity || 50;
    const condition = (weatherData.weather?.[0]?.main || "").toLowerCase();

    if (temp > 35) insights.push({ type: "WARNING", title: "Heat Stress", message: "High temperatures. Increase irrigation." });
    if (condition.includes("rain")) insights.push({ type: "ADVICE", title: "Rain Detected", message: "Save water; pause irrigation." });
    if (humidity > 85) insights.push({ type: "WARNING", title: "Pest Risk", message: "High humidity. Check for fungal growth." });

    if (insights.length === 0) insights.push({ type: "INFO", title: "Optimal", message: "Conditions are stable for farming." });

    return insights;
};
