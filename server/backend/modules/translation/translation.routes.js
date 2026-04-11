import express from "express";
import * as translationController from "./translation.controller.js";

const router = express.Router();

router.post("/", translationController.translate);
router.get("/glossary", translationController.getTranslations);
router.post("/glossary", translationController.addTranslation);
router.put("/glossary/:id", translationController.updateTranslation);
router.delete("/glossary/:id", translationController.deleteTranslation);

export default router;
