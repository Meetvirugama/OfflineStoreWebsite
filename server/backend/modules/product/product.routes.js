import express from "express";
import * as productController from "./product.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", productController.list); // Authenticated users can see products
router.get("/categories", productController.getCategories);
router.get("/low-stock", protect, restrictTo("ADMIN"), productController.getLowStock);

router.post("/", protect, restrictTo("ADMIN"), productController.create);
router.put("/:id", protect, restrictTo("ADMIN"), productController.update);
router.delete("/:id", protect, restrictTo("ADMIN"), productController.remove);
router.post("/stock", protect, restrictTo("ADMIN"), productController.updateStock);

export default router;
