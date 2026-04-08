import express from "express";
import {
    getPrices,
    getCropTrendAnalytics,
    getDistrictTrendAnalytics,
    getMarketTrendAnalytics,
    getBestMandi,
    getDashboardSummary,
    getMultiCropTrendAnalytics,
    triggerManualSync,
    triggerMockSync
} from "../controllers/mandiController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 🌾 PUBLIC LISTING (FOR FARMERS/USERS)
router.get("/prices", getPrices);

// 📈 ANALYTICS (DB SOURCED)
router.get("/trends/crop", getCropTrendAnalytics);
router.get("/trends/multi", getMultiCropTrendAnalytics);
router.get("/trends/district", getDistrictTrendAnalytics);
router.get("/trends/market", getMarketTrendAnalytics);
router.get("/dashboard", getDashboardSummary);
router.get("/best", getBestMandi);

// 🔒 ADMIN ONLY
router.post("/sync", 
    authMiddleware, 
    allowRoles(["ADMIN"]), 
    triggerManualSync
);

router.post("/sync/mock",
    authMiddleware,
    allowRoles(["ADMIN"]),
    triggerMockSync
);

export default router;
