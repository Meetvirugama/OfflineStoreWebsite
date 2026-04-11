import express from "express";
import * as translationController from "./translation.controller.js";

const router = express.Router();

router.post("/", translationController.translate);

export default router;
