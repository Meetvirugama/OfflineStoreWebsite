import express from "express";
import * as cropController from "./crop.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // Secure crop data

router.post("/save", cropController.addCrop);
router.get("/my", cropController.getMyCrops);
router.delete("/:id", cropController.deleteCrop);

router.get("/pest-history", cropController.getPestHistory);

export default router;
