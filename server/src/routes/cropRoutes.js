import express from "express";
import { getCropInfo, getCropTrendAnalytics, getRecommendation } from "../controllers/cropController.js";

const router = express.Router();

// 💡 CROP INFORMATION (Cached + External)
router.get("/:name", getCropInfo);

// 📈 PRICE TRENDS
router.get("/:name/trends", getCropTrendAnalytics);

// 🌦️ WEATHER RECOMMENDATIONS
router.get("/:name/recommendation", getRecommendation);

export default router;
