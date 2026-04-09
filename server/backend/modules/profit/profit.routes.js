import express from "express";
import * as profitController from "./profit.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect, restrictTo("ADMIN"));

router.post("/log", profitController.logSale);
router.get("/stats", profitController.getMyStats);

export default router;
