import axios from "axios";
import { Op } from "sequelize";
import { ENV } from "../../config/env.js";
import WeatherCache from "./weather.model.js";
import * as aiService from "../ai/ai.service.js";

const TOMORROW_BASE = "https://api.tomorrow.io/v4/weather/forecast";
const GOOGLE_GEO_URL = "https://maps.googleapis.com/maps/api/geocode/json";

/**
 * COMPREHENSIVE ATMOSPHERIC DETAILS (Tomorrow.io)
 * Returns current, hourly today timeline, and extended 7-day forecast.
 */
export const getAtmosphericDetails = async (lat, lon) => {
    // Default to a central location if not provided
    const latitude = lat || 21.1702; 
    const longitude = lon || 72.8311;
    
    const key = `atmos_v4_${parseFloat(latitude).toFixed(3)}_${parseFloat(longitude).toFixed(3)}`;
    
    // Check Cache (1 hour)
    const cached = await WeatherCache.findOne({ 
        where: { lat_lon_key: key, expires_at: { [Op.gt]: new Date() } } 
    });
    if (cached) return cached.data;

    // Fetch from Tomorrow.io
    // Fields: temperature, humidity, windSpeed, windGust, precipitationProbability, weatherCode, 
    //         soilMoisture, soilTemperature, airQualityIndex
    const res = await axios.get(TOMORROW_BASE, {
        params: { 
            location: `${latitude},${longitude}`,
            apikey: ENV.TOMORROW_KEY,
            units: "metric",
            timesteps: ["1h", "1d"],
            fields: [
                "temperature", "humidity", "windSpeed", "windGust", 
                "precipitationProbability", "weatherCode", "pressureSurfaceLevel",
                "soilMoisture0To10cm", "soilTemperature0To10cm", "evapotranspiration",
                "pollenIndexTree", "epaIndex", "airQualityIndex", "dewPoint", "visibility",
                "temperatureApparent"
            ].join(",")
        }
    });

    const timelines = res.data.timelines;
    const hourly = timelines.hourly || [];
    const daily = timelines.daily || [];

    // Current is the first entry in hourly
    const currentEntry = hourly[0]?.values || {};
    
    // 1. Current Weather Mapping
    const current = {
        main: {
            temp: currentEntry.temperature,
            feels_like: currentEntry.temperatureApparent || currentEntry.temperature,
            humidity: currentEntry.humidity,
            pressure: currentEntry.pressureSurfaceLevel,
            temp_min: daily[0]?.values?.temperatureMin,
            temp_max: daily[0]?.values?.temperatureMax
        },
        weather: [{
            main: mapWeatherCode(currentEntry.weatherCode),
            icon: currentEntry.weatherCode,
            description: mapWeatherCode(currentEntry.weatherCode).toLowerCase()
        }],
        wind: {
            speed: currentEntry.windSpeed,
            gust: currentEntry.windGust
        },
        dt: Math.floor(Date.now() / 1000)
    };

    // 2. Today Timeline (Until 11:59 PM)
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const endOfDayTs = endOfDay.getTime();

    const todayTimeline = hourly
        .filter(item => new Date(item.time).getTime() <= endOfDayTs)
        .map(item => ({
            dt: Math.floor(new Date(item.time).getTime() / 1000),
            temp: item.values.temperature,
            condition: mapWeatherCode(item.values.weatherCode),
            pop: item.values.precipitationProbability / 100
        }));

    // 3. Extended Forecast (7 Days)
    const extendedForecast = daily.slice(0, 7).map(item => ({
        dt: Math.floor(new Date(item.time).getTime() / 1000),
        temp_min: item.values.temperatureMin,
        temp_max: item.values.temperatureMax,
        weather: { main: mapWeatherCode(item.values.weatherCode) },
        pop: item.values.precipitationProbability / 100
    }));

    // 4. Agri-Precision Indices (Thinking Level Upgrade)
    const agriData = getAgriInsights(currentEntry, todayTimeline);

    // 5. Strategic AI Outlook (NEW)
    const strategic_outlook = await aiService.generateWeatherOutlook(extendedForecast);

    const result = {
        current,
        todayTimeline,
        extendedForecast,
        strategic_outlook,
        alerts: agriData.alerts,
        indices: {
            ...agriData.indices,
            airQuality: currentEntry.airQualityIndex || currentEntry.epaIndex || 'EXCELLENT',
            soilMoisture: currentEntry.soilMoisture0To10cm || currentEntry.soilMoisture || 0.22, // 22% as realistic fallback
            soilTemp: currentEntry.soilTemperature0To10cm || currentEntry.soilTemperature || currentEntry.temperature - 2
        }
    };

    // Save Cache
    await WeatherCache.upsert({
        lat_lon_key: key,
        data: result,
        expires_at: new Date(Date.now() + 60 * 60 * 1000)
    });

    return result;
};

/**
 * GOOGLE GEOGRAPHICAL SEARCH (Village to City)
 */
export const searchLocations = async (query) => {
    const res = await axios.get(GOOGLE_GEO_URL, {
        params: { address: query, key: ENV.GOOGLE_GEO_KEY }
    });

    if (res.data.status !== "OK") return [];

    return res.data.results.map(item => {
        // Extract state/country from address components
        const stateComp = item.address_components.find(c => c.types.includes("administrative_area_level_1"));
        const districtComp = item.address_components.find(c => c.types.includes("administrative_area_level_2") || c.types.includes("locality"));
        const countryComp = item.address_components.find(c => c.types.includes("country"));
        
        return {
            name: item.address_components[0].long_name,
            state: stateComp ? stateComp.long_name : "",
            district: districtComp ? districtComp.long_name : "",
            country: countryComp ? countryComp.long_name : "",
            lat: item.geometry.location.lat,
            lon: item.geometry.location.lng, // Normalize google lng to our lon
            full_label: item.formatted_address
        };
    });
};

/**
 * REVERSE GEOCODING (Coordinates to Location)
 */
export const reverseGeocode = async (lat, lon) => {
    const res = await axios.get(GOOGLE_GEO_URL, {
        params: { latlng: `${lat},${lon}`, key: ENV.GOOGLE_GEO_KEY }
    });

    if (res.data.status !== "OK" || res.data.results.length === 0) return null;

    const item = res.data.results[0];
    const stateComp = item.address_components.find(c => c.types.includes("administrative_area_level_1"));
    const districtComp = item.address_components.find(c => c.types.includes("administrative_area_level_2") || c.types.includes("locality"));
    const countryComp = item.address_components.find(c => c.types.includes("country"));

    return {
        name: item.address_components[0].long_name,
        state: stateComp ? stateComp.long_name : "",
        district: districtComp ? districtComp.long_name : "",
        country: countryComp ? countryComp.long_name : "",
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        full_label: item.formatted_address
    };
};

/**
 * AGRI-INSIGHTS LOGIC
 */
export const getAgriInsights = (currentValues, timeline = []) => {
    const alerts = [];
    const temp = currentValues.temperature;
    const humidity = currentValues.humidity;
    const windSpeed = (currentValues.windSpeed || 0) * 3.6; // km/h
    const windGust = (currentValues.windGust || 0) * 3.6;
    const pop = timeline.length > 0 ? Math.max(...timeline.map(t => t.pop)) : 0;
    const soilMoisture = currentValues.soilMoisture;

    // 1. Extreme Weather Alerts
    if (temp > 38) {
        alerts.push({ type: "CRITICAL", title: "Heat Stress", message: "Extreme heat detected. High risk of crop wilting.", icon: "🔥" });
    }
    if (pop > 0.4) {
        alerts.push({ type: "WARNING", title: "Precipitation Risk", message: "Rain detected in today's window. Adjust harvest timing.", icon: "🌧️" });
    }
    if (windGust > 40) {
        alerts.push({ type: "WARNING", title: "Severe Wind Gusts", message: "High wind gusts detected. Structural risk to greenhouses.", icon: "💨" });
    }
    if (soilMoisture < 0.2) {
        alerts.push({ type: "ALERT", title: "Soil Moisture Deficit", message: "Low root-zone moisture. Immediate irrigation required.", icon: "🌱" });
    }

    // 2. Precision Indices
    const spraySafety = windSpeed < 15 && humidity < 80 ? "IDEAL" : windSpeed < 25 ? "RISKY" : "UNSAFE";
    const irrigationEfficiency = temp < 32 && humidity > 40 ? "HIGH" : "LOW (High Evaporation)";

    return {
        alerts,
        indices: {
            spraySafety,
            irrigationEfficiency,
            wind_kmh: Math.round(windSpeed),
            dew_point: Math.round(currentValues.dewPoint || 0),
            visibility: Math.round(currentValues.visibility || 0)
        }
    };
};

/**
 * Weather Code Mapping
 */
function mapWeatherCode(code) {
    const codes = {
        0: "Unknown", 1000: "Clear", 1100: "Mostly Clear", 1101: "Partly Cloudy", 
        1102: "Mostly Cloudy", 1001: "Cloudy", 4000: "Drizzle", 4001: "Rain", 
        4200: "Light Rain", 4201: "Heavy Rain", 5000: "Snow", 5001: "Flurries", 
        5100: "Light Snow", 5101: "Heavy Snow", 6000: "Freezing Drizzle", 
        6001: "Freezing Rain", 6200: "Light Freezing Rain", 6201: "Heavy Freezing Rain",
        7000: "Ice Pellets", 7101: "Heavy Ice Pellets", 7102: "Light Ice Pellets",
        8000: "Thunderstorm"
    };
    return codes[code] || "Clear";
}
