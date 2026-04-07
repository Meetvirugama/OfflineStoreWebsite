import express from "express";
import { downloadInvoice } from "../controllers/invoiceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:orderId", authMiddleware, downloadInvoice);

export default router;