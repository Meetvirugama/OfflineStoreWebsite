import * as profitService from "./profit.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const logSale = asyncHandler(async (req, res) => {
    const result = await profitService.logProfit(req.user.id, req.body);
    sendResponse(res, 201, "Sale recorded successfully", result);
});

export const getMyStats = asyncHandler(async (req, res) => {
    const stats = await profitService.getStats(req.user.id);
    sendResponse(res, 200, "Financial statistics fetched", stats);
});
