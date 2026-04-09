import express from "express";
import * as mandiController from "./mandi.controller.js";

const router = express.Router();

router.get("/nearby", mandiController.getNearby);
router.get("/search", mandiController.search);
router.get("/prices", mandiController.getPrices);
router.get("/trends", mandiController.getTrends);

export default router;
