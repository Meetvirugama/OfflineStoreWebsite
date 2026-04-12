import * as mandiService from "./mandi.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const getNearby = asyncHandler(async (req, res) => {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) return sendResponse(res, 400, "Latitude and Longitude are required");
    
    const mandis = await mandiService.getNearbyMandis(lat, lng, radius);
    sendResponse(res, 200, "Nearby mandis fetched successfully", mandis);
});

export const getMapMarkers = asyncHandler(async (req, res) => {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) return sendResponse(res, 400, "Coordinates required");
    
    const mandis = await mandiService.getNearbyMandis(lat, lng, radius || 100000);
    // Optimized for Map: minimal payload
    const markers = mandis.map(m => ({
        name: m.name,
        lat: m.lat,
        lng: m.lng,
        price: m.modal_price,
        distance: m.distance
    }));
    
    sendResponse(res, 200, "Map markers fetched", markers);
});

export const getDetails = asyncHandler(async (req, res) => {
    const { name } = req.params;
    if (!name) return sendResponse(res, 400, "Mandi name required");
    
    const details = await mandiService.getMandiDetails(name);
    sendResponse(res, 200, "Detailed mandi info fetched", details);
});

export const search = asyncHandler(async (req, res) => {
    const { q } = req.query;
    if (!q) return sendResponse(res, 400, "Query string is required");
    
    const results = await mandiService.searchMandis(q);
    sendResponse(res, 200, "Mandi search results", results);
});

export const getPrices = asyncHandler(async (req, res) => {
    const { state, district, crop, date, page, limit } = req.query;
    const data = await mandiService.getLiveMandiPrices({ 
        state, district, crop, date, 
        page: parseInt(page) || 1, 
        limit: parseInt(limit) || 20 
    });
    sendResponse(res, 200, `Prices fetched successfully`, data);
});

export const getDistrictComparison = asyncHandler(async (req, res) => {
    const { crop, state } = req.query;
    if (!crop) return sendResponse(res, 400, "Crop is required");
    const data = await mandiService.getDistrictComparison(crop, state || "Gujarat");
    sendResponse(res, 200, "District comparisons fetched successfully", data);
});

export const getTrends = asyncHandler(async (req, res) => {
    const { crop, district, days, state } = req.query;
    if (!crop || !district) return sendResponse(res, 400, "Crop and District are required");
    
    // Using the refined multi-crop logic but for single crop
    const trends = await mandiService.getMultiCropComparison([crop], parseInt(days) || 30, district, state);
    sendResponse(res, 200, "Historical trends fetched successfully", trends);
});

export const getSummary = asyncHandler(async (req, res) => {
    const { state } = req.query;
    const summary = await mandiService.getAgriDashboardStats(state || "Gujarat");
    sendResponse(res, 200, "Market summary fetched successfully", summary);
});

export const getBestMandi = asyncHandler(async (req, res) => {
    const { crop } = req.query;
    if (!crop) return sendResponse(res, 400, "Crop is required");
    const best = await mandiService.getBestMandiPrice(crop);
    sendResponse(res, 200, "Best mandi fetched successfully", best);
});

export const getMultiTrends = asyncHandler(async (req, res) => {
    const { crops, days, district, state } = req.query;
    if (!crops) return sendResponse(res, 400, "Crops comma-separated string required");
    const cropList = crops.split(",");
    const data = await mandiService.getMultiCropComparison(cropList, parseInt(days) || 30, district, state);
    sendResponse(res, 200, "Multi-crop trends fetched successfully", data);
});

export const getAvailableCrops = asyncHandler(async (req, res) => {
    const crops = await mandiService.getUniqueCommodities();
    sendResponse(res, 200, "Available crops discovered successfully", crops);
});
