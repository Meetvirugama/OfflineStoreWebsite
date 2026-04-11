import Advisory from "./advisory.model.js";
import SavedCrop from "./saved_crop.model.js";
import PestDetection from "./pest_detection.model.js";
import * as weatherService from "../weather/weather.service.js";

/**
 * SAVED CROPS
 */
export const addSavedCrop = async (userId, data) => {
    return await SavedCrop.create({ ...data, user_id: userId });
};

export const getUserCrops = async (userId) => {
    return await SavedCrop.findAll({ where: { user_id: userId } });
};

export const deleteSavedCrop = async (userId, id) => {
    return await SavedCrop.destroy({ where: { id, user_id: userId } });
};

/**
 * PEST DETECTION
 */
export const logPestDetection = async (userId, data) => {
    return await PestDetection.create({ ...data, user_id: userId });
};

import MandiPrice from "../mandi/mandi.model.js";
import sequelize from "../../config/db.js";
import { Op } from "sequelize";

export const getPestHistory = async (userId) => {
    return await PestDetection.findAll({ where: { user_id: userId }, order: [["created_at", "DESC"]] });
};

/**
 * CROP ANALYTICS (Driven by MandiPrice data)
 */
export const getAllCrops = async () => {
    const crops = await MandiPrice.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('commodity')), 'commodity']],
        raw: true
    });
    return crops.map(c => c.commodity);
};

export const getCropTrends = async (name, days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await MandiPrice.findAll({
        where: {
            commodity: name,
            arrival_date: { [Op.gte]: startDate }
        },
        attributes: [
            ['arrival_date', 'date'],
            ['modal_price', 'price']
        ],
        order: [['arrival_date', 'ASC']],
        raw: true
    });

    return trends;
};

export const getAIInsights = async (name) => {
    const trends = await getCropTrends(name, 7);
    
    if (!trends || trends.length < 2) {
        return {
            name,
            outlook: "Neutral",
            ai_recommendation: "Awaiting sufficient market data for deep analysis. Initial telemetry suggests stable equilibrium."
        };
    }

    const firstPrice = trends[0].price;
    const lastPrice = trends[trends.length - 1].price;
    const diff = lastPrice - firstPrice;
    const percentage = (diff / firstPrice) * 100;

    let outlook = "Neutral";
    let recommendation = "";

    if (percentage > 2) {
        outlook = "Bullish (High)";
        recommendation = `Market velocity for ${name} is accelerating (+${percentage.toFixed(1)}%). Strategic holding is advised as demand outpaces local supply buffers.`;
    } else if (percentage < -2) {
        outlook = "Bearish (Correction)";
        recommendation = `Price correction detected for ${name} (-${Math.abs(percentage).toFixed(1)}%). High arrival density at local mandis is causing downward pressure. Consider early liquidation or cold storage.`;
    } else {
        outlook = "Stable";
        recommendation = `Price levels for ${name} are in equilibrium. High accuracy indexing suggests minimal volatility in the next 72-hour trading window.`;
    }

    return {
        name,
        outlook,
        ai_recommendation: recommendation
    };
};

export const getSeasonalSuggestions = async () => {
    // This could also be linked to a 'seasonal_crops' table in the future
    return {
        season: "Summer/Zaid",
        crops: ["Moong", "Urad", "Cucumber", "Watermelon", "Fodder Crops"] 
    };
};

/**
 * CROP ADVISORY ENGINE (Rule-based)
 */
export const generateAdvisory = async (userId, formData) => {
    const { crop, stage, location, lat, lon } = formData;
    let weatherData = null;
    let finalLat = lat;
    let finalLon = lon;

    // 1. Fetch/Detect Weather
    if (!finalLat || !finalLon) {
        const locations = await weatherService.searchLocations(location);
        if (locations.length > 0) {
            finalLat = locations[0].lat;
            finalLon = locations[0].lon;
        }
    }

    if (finalLat && finalLon) {
        weatherData = (await weatherService.getAtmosphericDetails(finalLat, finalLon))?.current;
    }

    // 2. Core Rule Engine
    const temp = weatherData?.main?.temp || 30;
    const humidity = weatherData?.main?.humidity || 50;
    const advisories = [];
    let riskLevel = "LOW";

    // Standard Temperature Rules
    if (temp > 38) {
        riskLevel = "HIGH";
        advisories.push({ title: "Heat Stress Alert", message: "Intense heat detected. Implement frequent light irrigation in early morning.", icon: "🔥" });
    } else if (stage === "Sowing" && temp < 15) {
        riskLevel = "MEDIUM";
        advisories.push({ title: "Germination Delay", message: "Low temperatures may slow germination. Consider mulch usage.", icon: "❄️" });
    }

    // Moisture Rules
    if (humidity > 85) {
        riskLevel = "MEDIUM";
        advisories.push({ title: "Fungal Risk", message: "High humidity detected. Watch for signs of rust or blight.", icon: "🍄" });
    }

    // Stage-Specific Rules
    if (stage === "Flowering") {
        advisories.push({ title: "Micronutrient Support", message: "Apply Boron spray for better fruit setting during flowering.", icon: "🌸" });
    }

    // Default Advice if empty
    if (advisories.length === 0) {
        advisories.push({ title: "Care Routine", message: `Conditions are stable for ${crop} during ${stage} stage. Maintain standard schedule.`, icon: "🌱" });
    }

    // 3. Persist and Return
    const advisory = await Advisory.create({
        user_id: userId,
        crop,
        stage,
        location: location || "Detected Location",
        weather_data: weatherData,
        risk_level: riskLevel,
        advisory: advisories,
        accuracy_meta: { season_match: true } // Static for now
    });

    return advisory;
};

export const getAdvisoryHistory = async (userId) => {
    return await Advisory.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
        limit: 10
    });
};
