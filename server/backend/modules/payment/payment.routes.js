import express from "express";
import * as paymentController from "./payment.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/verify", paymentController.verify);
router.get("/history", paymentController.getMyPayments);

export default router;
