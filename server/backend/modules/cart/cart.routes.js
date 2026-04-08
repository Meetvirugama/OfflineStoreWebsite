import express from "express";
import * as cartController from "./cart.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", cartController.getMyCart);
router.post("/add", cartController.addToCart);
router.delete("/:id", cartController.remove);
router.delete("/", cartController.clear);

export default router;
