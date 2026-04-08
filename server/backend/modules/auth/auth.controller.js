import * as authService from "./auth.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    // Note: Email sending is often handled here or in the service.
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
    // req.user is attached by the 'protect' middleware
    sendResponse(res, 200, "User profile fetched", req.user);
});
