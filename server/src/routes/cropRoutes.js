import express from "express";
import { getCropInfo, getCropTrendAnalytics, getRecommendation } from "../controllers/cropController.js";

const router = express.Router();

// 💡 CROP INFORMATION (Cached + External)
router.get("/:name", getCropInfo);

// 📈 PRICE TRENDS
router.get("/:name/trends", getCropTrendAnalytics);

// 🌦️ WEATHER RECOMMENDATIONS
router.get("/:name/recommendation", getRecommendation);

// 🤖 AI GROWTH INSIGHTS
router.get("/:name/ai-insights", getAIInsights);

// 🍂 SEASONAL RECOMMENDATIONS
router.get("/suggestions/seasonal", getSeasonalCrops);

export default router;
