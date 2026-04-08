import * as weatherService from "../services/weatherService.js";
import * as advisoryEngine from "../services/advisoryEngine.js";
import * as locationService from "../services/locationService.js";
import { CropAdvisory, Notification } from "../models/index.js";

/**
 * GENERATE CROP ADVISORY
 * POST /api/advisory/generate
 */
export const generateAdvisory = async (req, res) => {
    try {
        const { crop, stage, location, lat: reqLat, lon: reqLon } = req.body;
        const userId = req.user?.id;

        let lat = reqLat;
        let lon = reqLon;
        let finalLocationName = location;

        // 1. Resolve Location if only name is provided
        if (!lat || !lon) {
            const matches = await locationService.searchLocation(location);
            if (matches && matches.length > 0) {
                lat = matches[0].lat;
                lon = matches[0].lon;
                finalLocationName = matches[0].name;
            } else {
                return res.status(404).json({ error: "Location coordinates not found for the provided name." });
            }
        }

        // 2. Fetch Weather
        const weather = await weatherService.getCurrentWeather(lat, lon);

        // 3. Generate Advisory via Engine
        const { advisories, risk_level, accuracy_meta } = advisoryEngine.generateAdvisory(weather, crop, stage);

        // 4. Save to Database
        const savedAdvisory = await CropAdvisory.create({
            user_id: userId,
            crop,
            stage,
            location: finalLocationName,
            weather_data: weather,
            advisory: advisories,
            risk_level,
            accuracy_meta
        });


        // 5. If Risk is HIGH, Create a System Notification
        if (risk_level === "HIGH") {
            await Notification.create({
                type: "CROP_ADVISORY",
                message: `⚠️ HIGH RISK detected for your ${crop} (${stage}). Check your advisory dashboard.`,
                reference_id: savedAdvisory.id
            });
        }

        res.status(201).json(savedAdvisory);

    } catch (err) {
        console.error("❌ Advisory Controller Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * GET ADVISORY HISTORY
 * GET /api/advisory/history
 */
export const getHistory = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { crop } = req.query;

        const where = { user_id: userId };
        if (crop) where.crop = crop;

        const history = await CropAdvisory.findAll({
            where,
            order: [['created_at', 'DESC']],
            limit: 20
        });

        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
