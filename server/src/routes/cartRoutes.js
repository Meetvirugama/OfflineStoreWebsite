import express from "express";
import {
    addToCart,
    getCart,
    updateCart,
    deleteCartItem,
    checkout
} from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/:customer_id", authMiddleware, getCart);
router.put("/:id", authMiddleware, updateCart);
router.delete("/:id", authMiddleware, deleteCartItem);  // 🔥 NEW DELETE route
router.post("/checkout", authMiddleware, checkout);

export default router;