import express from "express";
import * as supplierController from "./supplier.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("ADMIN")); // Supplier network via Admin only

router.get("/", supplierController.list);
router.get("/:id", supplierController.getById);
router.get("/:id/products", supplierController.getSupplierProducts);
router.post("/", supplierController.create);
router.put("/:id", supplierController.update);
router.delete("/:id", supplierController.remove);

export default router;
