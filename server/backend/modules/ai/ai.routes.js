import express from "express";
import * as aiController from "./ai.controller.js";

const router = express.Router();

router.post("/advisory", aiController.getCropAdvisory);
router.post("/disease", aiController.getPestDiseaseInsight);
router.post("/chat", aiController.getFarmerChat);

export default router;
