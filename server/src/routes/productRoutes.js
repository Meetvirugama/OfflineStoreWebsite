import express from "express";
import {
  createProduct,
  getLowStock,
  getStock,
  getProducts,
  updateProduct
} from "../controllers/productController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();


// 🔥 PUBLIC ROUTE (NO LOGIN REQUIRED)
router.get("/", getProducts);


// 🔒 ADMIN ONLY
router.post("/",
  authMiddleware,
  createProduct
);


// 🔒 STAFF / ADMIN
router.get("/stock/:id",
  authMiddleware,
  getStock
);


// 🔒 ADMIN ONLY
router.put("/:id",
  authMiddleware,
  updateProduct
);


// 🔒 ADMIN ONLY
router.get("/low-stock",
  authMiddleware,
  getLowStock
);

export default router;