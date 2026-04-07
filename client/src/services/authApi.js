import API from "./axios";

export const loginUser = (data) => API.post("/auth/login", data);
export const verifyOtp = (data) => API.post("/auth/verify-otp", data);