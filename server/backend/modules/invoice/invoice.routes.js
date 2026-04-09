import express from "express";
import * as invoiceController from "./invoice.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

// All invoice downloads require authentication
router.get("/:orderId", protect, invoiceController.downloadInvoice);

export default router;
