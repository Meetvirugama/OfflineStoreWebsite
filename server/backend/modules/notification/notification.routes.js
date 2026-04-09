import express from "express";
import * as notificationController from "./notification.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", notificationController.getMy);
router.put("/:id/read", notificationController.read);
router.post("/remind/:orderId", notificationController.remind);

export default router;
