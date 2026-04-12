import express from "express";
import * as cropController from "./crop.controller.js";
import { protect, optionalProtect } from "../../middleware/auth.middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/save", protect, cropController.addCrop);
router.get("/my", protect, cropController.getMyCrops);
router.delete("/:id", protect, cropController.deleteCrop);
router.get("/pest-history", protect, cropController.getPestHistory);
router.post("/detect-pest", optionalProtect, upload.array('images'), cropController.detectPest);

// Analytics
router.get("/list", cropController.getCrops);
router.get("/seasonal", cropController.getSeasonal);
router.get("/:name/trends", cropController.getTrends);
router.get("/:name/insights", cropController.getInsights);

// Advisory
router.post("/advisory", optionalProtect, cropController.generateAdvisory);
router.get("/advisory/history", optionalProtect, cropController.getAdvisoryHistory);

export default router;
