import express from "express";
import * as supportController from "./support.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/inquiry", protect, supportController.sendInquiry);

export default router;
