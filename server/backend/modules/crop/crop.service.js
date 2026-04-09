import SavedCrop from "./saved_crop.model.js";
import PestDetection from "./pest_detection.model.js";
import { asyncHandler } from "../../utils/errorHandler.js";

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
    // Return empty or basic DB-derived insight
    return {
        name,
        outlook: "Stable",
        ai_recommendation: "Awaiting sufficient market data for deep analysis."
    };
};

export const getSeasonalSuggestions = async () => {
    // This could also be linked to a 'seasonal_crops' table in the future
    return {
        season: "Current Season",
        crops: [] 
    };
};
