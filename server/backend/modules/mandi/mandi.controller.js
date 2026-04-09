import * as mandiService from "./mandi.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const getNearby = asyncHandler(async (req, res) => {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) return sendResponse(res, 400, "Latitude and Longitude are required");
    
    const mandis = await mandiService.getNearbyMandis(lat, lng, radius);
    sendResponse(res, 200, "Nearby mandis fetched successfully", mandis);
});

export const search = asyncHandler(async (req, res) => {
    const { q } = req.query;
    if (!q) return sendResponse(res, 400, "Query string is required");
    
    const results = await mandiService.searchMandis(q);
    sendResponse(res, 200, "Mandi search results", results);
});

export const getPrices = asyncHandler(async (req, res) => {
    const { state, district, crop } = req.query;
    const prices = await mandiService.getLiveMandiPrices({ state, district, crop });
    sendResponse(res, 200, `Live prices fetched successfully`, prices);
});

export const getTrends = asyncHandler(async (req, res) => {
    const { crop, district, days } = req.query;
    if (!crop || !district) return sendResponse(res, 400, "Crop and District are required");
    
    const trends = await mandiService.getHistoricalMandiTrends(crop, district, parseInt(days) || 30);
    sendResponse(res, 200, "Historical trends fetched successfully", trends);
});
