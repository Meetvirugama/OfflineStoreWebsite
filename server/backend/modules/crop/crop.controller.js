import * as cropService from "./crop.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

/**
 * SAVED CROPS
 */
export const addCrop = asyncHandler(async (req, res) => {
    const result = await cropService.addSavedCrop(req.user.id, req.body);
    sendResponse(res, 201, "Crop added to your farm", result);
});

export const getMyCrops = asyncHandler(async (req, res) => {
    const result = await cropService.getUserCrops(req.user.id);
    sendResponse(res, 200, "Your saved crops", result);
});

export const deleteCrop = asyncHandler(async (req, res) => {
    await cropService.deleteSavedCrop(req.user.id, req.params.id);
    sendResponse(res, 200, "Crop removed from your list");
});

/**
 * PEST DETECTION
 */
export const getPestHistory = asyncHandler(async (req, res) => {
    const result = await cropService.getPestHistory(req.user.id);
    sendResponse(res, 200, "Your pest detection history", result);
});

export const detectPest = asyncHandler(async (req, res) => {
    const { crop } = req.body;
    // For guest usability, we allow detection but only save history if user exists
    const userId = req.user?.id || 0; 
    
    if (!crop) return sendResponse(res, 400, "Select a crop for analysis");

    const result = await cropService.detectPest(userId, crop, req.files);
    sendResponse(res, 201, "AI Diagnostic complete", result);
});

/**
 * CROP ANALYTICS
 */
export const getCrops = asyncHandler(async (req, res) => {
    const result = await cropService.getAllCrops();
    sendResponse(res, 200, "Crops list fetched", result);
});

/**
 * CROP ANALYTICS
 */
export const getTrends = asyncHandler(async (req, res) => {
    const { name } = req.params;
    const { days } = req.query;
    const result = await cropService.getCropTrends(name, parseInt(days) || 30);
    sendResponse(res, 200, "Crop trends fetched", result);
});

export const getInsights = asyncHandler(async (req, res) => {
    const { name } = req.params;
    const result = await cropService.getAIInsights(name);
    sendResponse(res, 200, "AI Insights fetched", result);
});

export const getSeasonal = asyncHandler(async (req, res) => {
    const result = await cropService.getSeasonalSuggestions();
    sendResponse(res, 200, "Seasonal suggestions fetched", result);
});

/**
 * CROP ADVISORY
 */
export const generateAdvisory = asyncHandler(async (req, res) => {
    const result = await cropService.generateAdvisory(req.user?.id, req.body);
    sendResponse(res, 201, "Precision advisory generated", result);
});

export const getAdvisoryHistory = asyncHandler(async (req, res) => {
    if (!req.user) {
        return sendResponse(res, 200, "No history for guests", []);
    }
    const result = await cropService.getAdvisoryHistory(req.user.id);
    sendResponse(res, 200, "Advisory history fetched", result);
});
