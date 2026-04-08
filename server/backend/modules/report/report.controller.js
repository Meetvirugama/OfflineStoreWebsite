import * as reportService from "./report.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const getSalesSummary = asyncHandler(async (req, res) => {
    const { start, end } = req.query;
    const result = await reportService.getSalesReport(start || "1970-01-01", end || new Date());
    sendResponse(res, 200, "Sales report fetched", result);
});

export const getInventorySummary = asyncHandler(async (req, res) => {
    const result = await reportService.getInventoryReport();
    sendResponse(res, 200, "Inventory report fetched", result);
});
