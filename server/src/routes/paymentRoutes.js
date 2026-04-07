import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
  addPayment,
  getPaymentsByOrder
} from "../controllers/paymentController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createRazorpayOrder);
router.post("/verify", authMiddleware, verifyPayment);

router.post("/", authMiddleware, allowRoles("ADMIN", "STAFF", "CUSTOMER"), addPayment);

router.get("/:orderId", authMiddleware, getPaymentsByOrder);

export default router;