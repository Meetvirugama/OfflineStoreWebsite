import * as authService from "./auth.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { ENV } from "../../config/env.js";
import axios from "axios";

export const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    sendResponse(res, 201, "OTP sent successfully. Please verify your email.", { email: result.email });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendResponse(res, 200, "Login successful", result);
});

export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    await authService.verifyOtp(email, otp);
    sendResponse(res, 200, "Verification successful");
});

export const getMe = asyncHandler(async (req, res) => {
    sendResponse(res, 200, "User profile fetched", req.user);
});

// === GOOGLE OAUTH FLOW ===

export const googleInit = (req, res) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: ENV.REDIRECT_URI,
        client_id: ENV.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    const qs = new URLSearchParams(options).toString();
    return res.redirect(`${rootUrl}?${qs}`);
};

export const googleCallback = asyncHandler(async (req, res) => {
    const code = req.query.code;
    if (!code) return res.redirect(`${ENV.BASE_API_URL.split("/api")[0]}/auth/login?error=no_code`);

    try {
        // Exchange code for tokens
        const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: ENV.GOOGLE_CLIENT_ID,
            client_secret: ENV.GOOGLE_CLIENT_SECRET,
            redirect_uri: ENV.REDIRECT_URI,
            grant_type: "authorization_code",
        });

        const { access_token } = tokenRes.data;

        // Fetch user info
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`);
        const googleUser = userRes.data;

        // Login or Register
        const { token } = await authService.googleLogin({
            name: googleUser.name,
            email: googleUser.email,
        });

        // Redirect back to frontend with token
        return res.redirect(`${ENV.BASE_API_URL.split("/api")[0]}/google-success?token=${token}`);

    } catch (err) {
        console.error("Google Auth Error:", err.message);
        return res.redirect(`${ENV.BASE_API_URL.split("/api")[0]}/auth/login?error=auth_failed`);
    }
});
