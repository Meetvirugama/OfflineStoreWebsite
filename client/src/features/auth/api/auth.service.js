import apiClient from "../../../core/api/client.js";

/**
 * Authentication Feature Service
 */
export const login = (data) => apiClient.post("/auth/login", data);
export const register = (data) => apiClient.post("/auth/register", data);
export const verifyOtp = (data) => apiClient.post("/auth/verify-otp", data);
export const forgotPassword = (data) => apiClient.post("/auth/forgot-password", data);
export const resetPassword = (data) => apiClient.post("/auth/reset-password", data);

export const getProfile = () => apiClient.get("/users/profile");
export const updateProfile = (data) => apiClient.put("/users/profile", data);
