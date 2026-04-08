import express from "express";
import * as userController from "./user.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // Secure all user routes

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);

export default router;
