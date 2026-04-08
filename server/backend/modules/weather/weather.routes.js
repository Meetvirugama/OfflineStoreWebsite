import express from "express";
import * as weatherController from "./weather.controller.js";

const router = express.Router();

router.get("/current", weatherController.getCurrent);
router.get("/forecast", weatherController.getForecast);

export default router;
