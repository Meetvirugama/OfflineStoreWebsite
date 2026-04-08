import * as priceService from "./price.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const compare = asyncHandler(async (req, res) => {
    const { crop, markets } = req.query;
    if (!crop || !markets) return sendResponse(res, 400, "Crop and market list are required");
    
    const marketList = markets.split(",");
    const result = await priceService.getComparison(crop, marketList);
    sendResponse(res, 200, "Price comparison fetched", result);
});

export const getHistory = asyncHandler(async (req, res) => {
    const { crop, district } = req.query;
    const result = await priceService.getHistory(crop, district);
    sendResponse(res, 200, "Price history fetched", result);
});
