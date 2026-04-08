import express from "express";
import { addLocation, getMyLocations, updateDefault, searchLocations } from "../controllers/locationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @public
 * @route GET /api/locations/search
 * @desc Search for physical locations (Geocoding)
 */
router.get("/search", searchLocations);

/**
 * @private
 * @route POST /api/locations
 * @desc Save a new user location
 */
router.post("/", authMiddleware, addLocation);

/**
 * @private
 * @route GET /api/locations
 * @desc List all saved locations for the user
 */
router.get("/", authMiddleware, getMyLocations);

/**
 * @private
 * @route PUT /api/locations/:id/default
 * @desc Set a location as default
 */
router.put("/:id/default", authMiddleware, updateDefault);

export default router;
