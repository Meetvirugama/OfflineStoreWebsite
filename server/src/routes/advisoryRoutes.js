import express from "express";
import * as advisoryController from "../controllers/advisoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All advisory routes require authentication for history tracking
router.post("/generate", authMiddleware, advisoryController.generateAdvisory);
router.get("/history", authMiddleware, advisoryController.getHistory);

export default router;
