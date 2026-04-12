import express from "express";
import * as mandiController from "./mandi.controller.js";

const router = express.Router();

router.get("/nearby", mandiController.getNearby);
router.get("/map", mandiController.getMapMarkers);
router.get("/details/:name", mandiController.getDetails);
router.get("/search", mandiController.search);
router.get("/prices", mandiController.getPrices);
router.get("/trends", mandiController.getTrends);
router.get("/summary", mandiController.getSummary);
router.get("/best-mandi", mandiController.getBestMandi);
router.get("/comparison", mandiController.getDistrictComparison);
router.get("/trends/multi", mandiController.getMultiTrends);

export default router;
