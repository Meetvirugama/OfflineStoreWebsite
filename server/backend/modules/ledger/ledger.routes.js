import express from "express";
import * as ledgerController from "./ledger.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", ledgerController.getMyLedger);
router.get("/summary", ledgerController.getSummary);

export default router;
