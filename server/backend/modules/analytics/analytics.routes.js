import express from "express";
import { marketOutlookController } from "./analytics.controller.js";

const router = express.Router();

router.get("/market-outlook", marketOutlookController);

export default router;
