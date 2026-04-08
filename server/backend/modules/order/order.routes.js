import express from "express";
import * as orderController from "./order.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/checkout", orderController.checkout);
router.get("/my", orderController.getMyOrders);

export default router;
