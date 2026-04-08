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
