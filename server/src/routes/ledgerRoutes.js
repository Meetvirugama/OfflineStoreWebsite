import express from "express";
import { getCustomerLedger } from "../controllers/ledgerController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/:customer_id",
    authMiddleware,
    allowRoles("ADMIN"),
    getCustomerLedger
);

export default router;