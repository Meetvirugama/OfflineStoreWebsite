import express from "express";
import * as dashboardController from "./dashboard.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/stats", restrictTo("ADMIN"), dashboardController.getStats);
router.post("/track", dashboardController.trackActivity);

export default router;
