import express from "express";
import * as weatherController from "./weather.controller.js";

const router = express.Router();

router.get("/details", weatherController.getAtmosphericDetails);
router.get("/search", weatherController.searchLocations);

export default router;
