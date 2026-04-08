import * as weatherService from "./weather.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const getCurrent = asyncHandler(async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return sendResponse(res, 400, "Latitude and Longitude are required");

    const weather = await weatherService.getCurrentWeather(lat, lon);
    const insights = weatherService.getFarmingInsights(weather);

    sendResponse(res, 200, "Weather data fetched", { current: weather, insights });
});

export const getForecast = asyncHandler(async (req, res) => {
    // Forecast logic would be implemented similar to current
    sendResponse(res, 200, "Forecast logic coming soon");
});
