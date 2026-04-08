import express from "express";
import * as dashboardController from "./dashboard.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/stats", dashboardController.getStats);
router.post("/track", dashboardController.trackActivity);

export default router;
