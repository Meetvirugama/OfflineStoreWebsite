import axios from "axios";
import qs from "qs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createCustomerService } from "./customerService.js";

// Use functions to retrieve environment variables at runtime.
// This prevents ES module hoisting issues where process.env is read before dotenv is configured in server.js.
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
  JWT_SECRET
} from "../config/env.js";

// Ensure REDIRECT_URI is exactly what we expect (no trailing slashes, correct port)
const FINAL_REDIRECT_URI = REDIRECT_URI.trim();

// The constants are now imported directly from env.js to avoid hoisting issues.

export const getGoogleAuthUrl = () => {
  const params = {
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: FINAL_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  };
  const query = qs.stringify(params, { encode: true });
  return `https://accounts.google.com/o/oauth2/v2/auth?${query}`;
};

const exchangeCodeForToken = async (code) => {
  const tokenUrl = "https://oauth2.googleapis.com/token";
  
  // 🛑 CRITICAL: Ensure REDIRECT_URI exactly matches the one in Google Console 
  // and the one used in getGoogleAuthUrl()
  const payload = {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: FINAL_REDIRECT_URI,
    grant_type: "authorization_code",
  };

  try {
    console.log(`📡 Exchanging code for Google token (Target: ${FINAL_REDIRECT_URI})...`);
    const response = await axios.post(tokenUrl, qs.stringify(payload), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    return response.data.access_token;
  } catch (error) {
    const errorData = error.response?.data || error.message;
    console.error("❌ Google Token Exchange Failed:", errorData);
    throw new Error(`Google Auth Failed: ${errorData.error_description || error.message}`);
  }
};

const fetchGoogleUserProfile = async (accessToken) => {
  try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Google Profile Fetch Failed:", error.response?.data || error.message);
    throw new Error("Failed to fetch Google profile");
  }
};

export const handleGoogleCallback = async (code) => {
  if (!code) throw new Error("No authorization code provided");
  // 1. Exchange code for access token
  const accessToken = await exchangeCodeForToken(code);
  // 2. Fetch user profile from Google
  const profile = await fetchGoogleUserProfile(accessToken);

  // Try multiple common Google profile fields
  const email = profile.email || profile.emails?.[0]?.value || profile.id + "@google-oauth.com";
  const name = profile.name || profile.displayName || profile.given_name || "Google User";

  if (!email) {
    throw new Error("No email found in Google profile");
  }

  // 3. Find or create user in DB
  let user = await User.findOne({ where: { email } });
  if (!user) {
    // 🔥 NEW: Special check for primary account to ensure it's always an ADMIN
    const shouldBeAdmin = email === "meet56963@gmail.com" || email === "meetvirugama4902@gmail.com";

    user = await User.create({
      name: name || "Google User",
      email,
      password: null,
      auth_provider: "GOOGLE",
      role: shouldBeAdmin ? "ADMIN" : "CUSTOMER",
      is_verified: true, // Google users are pre-verified
    });

    // Create linked customer record
    // Using a shorter timestamp derived ID to prevent VARCHAR(20) overflow
    await createCustomerService({
      name: user.name,
      mobile: `G-${user.id}-${Date.now().toString().slice(-8)}`, // Max ~16 chars
      user_id: user.id,
    });
  }

  // Ensure existing user is also marked as verified if they just logged in with Google
  if (!user.is_verified) {
    user.is_verified = true;
    await user.save();
  }

  // 4. Generate JWT
  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};
