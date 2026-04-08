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
    const { crop } = req.params;
    const prices = await mandiService.getPriceStats(crop);
    sendResponse(res, 200, `Prices for ${crop}`, prices);
});
