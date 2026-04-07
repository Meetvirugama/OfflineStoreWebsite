import express from "express";
import { getAllReports } from "../controllers/reportController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", authMiddleware, getAllReports);

export default router;