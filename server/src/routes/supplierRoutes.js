import express from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplierProducts,
  purchaseHistory,
  supplierReport
} from "../controllers/supplierController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { attachUser } from "../middlewares/attachUser.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/",
    authMiddleware,
    allowRoles("ADMIN"),
    createSupplier
);

router.get("/",
    authMiddleware,
    allowRoles("ADMIN"),
    getSuppliers
);

router.get("/:id",
    authMiddleware,
    allowRoles("ADMIN"),
    getSupplierById
);

router.put("/:id",
    authMiddleware,
    allowRoles("ADMIN"),
    updateSupplier
);

router.delete("/:id",
    authMiddleware,
    allowRoles("ADMIN"),
    deleteSupplier
);

router.get("/:id/products",
    authMiddleware,
    allowRoles("ADMIN"),
    getSupplierProducts
);

router.get("/:id/report",
    authMiddleware,
    allowRoles("ADMIN"),
    supplierReport
);

router.get("/:id/purchase-history",
    authMiddleware,
    allowRoles("ADMIN"),
    purchaseHistory
);

export default router;