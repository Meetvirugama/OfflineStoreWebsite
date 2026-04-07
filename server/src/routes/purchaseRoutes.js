import express from "express";
import { createPurchase } from "../controllers/purchaseController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { attachUser } from "../middlewares/attachUser.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/",
    authMiddleware,
    allowRoles("ADMIN"),
    createPurchase
);

export default router;