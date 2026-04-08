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

export const getPestHistory = async (userId) => {
    return await PestDetection.findAll({ where: { user_id: userId }, order: [["created_at", "DESC"]] });
};
