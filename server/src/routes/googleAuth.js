import express from "express";
import { getGoogleAuthUrl, handleGoogleCallback } from "../services/googleOAuthService.js";

const router = express.Router();

// Initiate Google OAuth flow
router.get("/google", (req, res) => {
  res.redirect(getGoogleAuthUrl());
});

// Google OAuth callback
router.get("/google/callback", async (req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`${frontendUrl}/auth/login?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      throw new Error("Missing authorization code");
    }

    const token = await handleGoogleCallback(code);
    res.redirect(`${frontendUrl}/google-success?token=${token}`);
  } catch (err) {
    console.error("❌ Google OAuth Route Error:", err.message);
    next(err);
  }
});

export default router;
