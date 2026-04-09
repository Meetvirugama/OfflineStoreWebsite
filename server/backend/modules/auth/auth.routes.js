import express from "express";
import * as authController from "./auth.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);

router.get("/me", protect, authController.getMe);

// Google OAuth
router.get("/google", authController.googleInit);
router.get("/google/callback", authController.googleCallback);

export default router;
