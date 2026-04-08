import express from "express";
import * as priceController from "./price.controller.js";

const router = express.Router();

router.get("/compare", priceController.compare);
router.get("/history", priceController.getHistory);

export default router;
