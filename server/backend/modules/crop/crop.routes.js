import express from "express";
import * as cropController from "./crop.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/save", protect, cropController.addCrop);
router.get("/my", protect, cropController.getMyCrops);
router.delete("/:id", protect, cropController.deleteCrop);
router.get("/pest-history", protect, cropController.getPestHistory);

// Analytics
router.get("/list", cropController.getCrops);
router.get("/seasonal", cropController.getSeasonal);
router.get("/:name/trends", cropController.getTrends);
router.get("/:name/insights", cropController.getInsights);

export default router;
