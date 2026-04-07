import express from "express";
import {
  createProduct,
  getLowStock,
  getProducts,
  getStock,
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
router.get("/low-stock",
  authMiddleware,
  getLowStock
);

export default router;