import express from "express";
import { getStock, adjustStock } from "../controllers/inventoryController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/stock/:product_id",
    authMiddleware,
    allowRoles("ADMIN"),
    getStock
);

router.post("/adjust",
    authMiddleware,
    allowRoles("ADMIN"),
    adjustStock
);

export default router;