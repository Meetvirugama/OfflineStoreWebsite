import express from "express";
import * as productController from "./product.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import * as productService from "./product.service.js";
import { sendResponse } from "../../utils/response.js";

const router = express.Router();

/**
 * Handle Specialized Inventory Adjustments
 * Map frontend 'reference_type' to backend 'note'
 */
router.post("/adjust", protect, restrictTo("ADMIN"), asyncHandler(async (req, res) => {
    const { product_id, quantity, type, reference_type } = req.body;
    if (!product_id) throw new Error("Product ID is required for adjustment");
    
    await productService.updateStock(product_id, quantity, type, reference_type);
    
    sendResponse(res, 200, "Inventory balanced and logged successfully 📊");
}));

export default router;
