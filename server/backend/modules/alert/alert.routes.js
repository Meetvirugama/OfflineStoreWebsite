import express from "express";
import * as alertController from "./alert.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", alertController.create);
router.get("/", alertController.list);
router.delete("/:id", alertController.remove);

export default router;
