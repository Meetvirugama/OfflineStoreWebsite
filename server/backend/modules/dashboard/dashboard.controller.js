import * as dashboardService from "./dashboard.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const getStats = asyncHandler(async (req, res) => {
    let stats;
    if (req.user.role === "ADMIN") {
        stats = await dashboardService.getAdminStats();
    } else {
        stats = await dashboardService.getFarmerStats(req.user.id);
    }
    sendResponse(res, 200, "Dashboard statistics fetched", stats);
});

export const trackActivity = asyncHandler(async (req, res) => {
    // Logic for tracking clicks/visits
    sendResponse(res, 200, "Activity tracked");
});
