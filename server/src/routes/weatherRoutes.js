import express from "express";
import { getWeather, getWeatherForecast, searchByCity } from "../controllers/weatherController.js";

const router = express.Router();

/**
 * @route GET /api/weather/current
 * @desc Get current weather and farming insights
 */
router.get("/current", getWeather);

/**
 * @route GET /api/weather/forecast
 * @desc Get hourly and daily forecast
 */
router.get("/forecast", getWeatherForecast);

/**
 * @route GET /api/weather/by-city
 * @desc Search for a location by name
 */
router.get("/by-city", searchByCity);

export default router;
