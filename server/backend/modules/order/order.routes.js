import express from "express";
import * as orderController from "./order.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/checkout", orderController.checkout);
router.get("/my", orderController.getMyOrders);

// Admin Management
router.get("/", restrictTo("ADMIN"), orderController.listAllOrders);
router.put("/:id/status", restrictTo("ADMIN"), orderController.updateStatus);
router.get("/:id", orderController.getOrderDetails);

export default router;
