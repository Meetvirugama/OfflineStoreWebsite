import * as weatherService from "./weather.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const getAtmosphericDetails = asyncHandler(async (req, res) => {
    const { lat, lon } = req.query;

    const data = await weatherService.getAtmosphericDetails(lat, lon);

    sendResponse(res, 200, "Atmospheric details synchronized", data);
});

export const searchLocations = asyncHandler(async (req, res) => {
    const { q } = req.query;
    if (!q) return sendResponse(res, 400, "Search query is required");

    const locations = await weatherService.searchLocations(q);
    sendResponse(res, 200, "Locations found", { locations });
});

export const reverseGeocode = asyncHandler(async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return sendResponse(res, 400, "Latitude and Longitude are required");

    const location = await weatherService.reverseGeocode(lat, lon);
    sendResponse(res, 200, "Location geocoded", { location });
});
