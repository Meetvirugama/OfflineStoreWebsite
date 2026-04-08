import express from "express";
import * as customerController from "./customer.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // Secure customer data

router.post("/", restrictTo("ADMIN"), customerController.create);
router.get("/", customerController.list);
router.get("/:id", customerController.get);
router.put("/:id", restrictTo("ADMIN"), customerController.update);
router.delete("/:id", restrictTo("ADMIN"), customerController.remove);

export default router;
