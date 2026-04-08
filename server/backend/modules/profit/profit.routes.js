import express from "express";
import * as profitController from "./profit.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/log", profitController.logSale);
router.get("/stats", profitController.getMyStats);

export default router;
