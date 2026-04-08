import express from "express";
import * as reportController from "./report.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect, restrictTo("ADMIN")); // Secure reports to Admins only

router.get("/sales", reportController.getSalesSummary);
router.get("/inventory", reportController.getInventorySummary);

export default router;
