import { getCropData, getCropTrends, getSeasonalSuggestions, getAIAnalysis } from "../services/cropService.js";
import { getWeatherRecommendation } from "../services/weatherService.js";

/**
 * GET CROP INFO
 */
export const getCropInfo = async (req, res) => {
    try {
        const { name } = req.params;
        const data = await getCropData(name);
        res.json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET CROP TRENDS
 */
export const getCropTrendAnalytics = async (req, res) => {
    try {
        const { name } = req.params;
        const { days } = req.query;
        const prices = await getCropTrends(name, parseInt(days) || 30);
        res.json({ crop: name, prices });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET WEATHER RECOMMENDATION
 */
export const getRecommendation = async (req, res) => {
    try {
        const { name } = req.params;
        const { lat, lon } = req.query;
        const data = await getWeatherRecommendation(name, lat, lon);
        res.json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET SEASONAL SUGGESTIONS
 */
export const getSeasonalCrops = async (req, res) => {
    try {
        const data = getSeasonalSuggestions();
        res.json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET AI INSIGHTS
 */
export const getAIInsights = async (req, res) => {
    try {
        const { name } = req.params;
        const data = await getAIAnalysis(name);
        res.json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

