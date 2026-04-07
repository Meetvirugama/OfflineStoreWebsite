import { create } from "zustand";
import api from "../services/axiosInstance";

const decodeToken = (t) => {
  try { return JSON.parse(atob(t.split('.')[1])); } catch { return null; }
};

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("agromart_token") || null,
  user: decodeToken(localStorage.getItem("agromart_token")) || null, // { id, role }
  customer: null,
  loading: false,
  initialized: false,
  initInProgress: false,

  // LOGIN
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("agromart_token", token);
      const decoded = decodeToken(token);
      set({ token, user: decoded, loading: false });

      // fetch profile immediately for all verified users
      if (decoded?.role) {
        await get().fetchMe();
      }
      return { success: true };
    } catch (err) {
      set({ loading: false });
      throw new Error(err.response?.data?.message || "Login failed");
    }
  },

  // REGISTER
  register: async (data) => {
    set({ loading: true });
    try {
      await api.post("/auth/register", data);
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  },

  // VERIFY OTP
  verifyOtp: async (email, otp) => {
    set({ loading: true });
    try {
      await api.post("/auth/verify-otp", { email, otp });
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      throw new Error(err.response?.data?.message || "Invalid OTP");
    }
  },

  // RESEND OTP
  resendOtp: async (email) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/resend-otp", { email });
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false });
      throw new Error(err.response?.data?.message || "Failed to resend OTP");
    }
  },

  // FETCH CUSTOMER PROFILE
  fetchMe: async () => {
    try {
      const res = await api.get("/me/me");
      set({ customer: res.data, initialized: true });
      return res.data;
    } catch (err) {
      console.error("Fetch profile failed:", err);
      // Still set initialized to true so the app doesn't hang
      set({ initialized: true });
      return null;
    }
  },

  // UPDATE PROFILE
  updateProfile: async (data) => {
    const res = await api.put("/me/me", data);
    set({ customer: res.data });
    return res.data;
  },

  // LOGOUT
  logout: async () => {
    try { await api.post("/auth/logout"); } catch {
      throw new Error("Logout failed");
    }
    localStorage.removeItem("agromart_token");
    set({ token: null, user: null, customer: null });
  },

  init: async (force = false) => {
    const { initialized, initInProgress } = get();
    if (!force && (initialized || initInProgress)) return;

    set({ initInProgress: true });
    
    try {
      const token = localStorage.getItem("agromart_token");
      if (!token) {
        set({ initialized: true, initInProgress: false });
        return;
      }

      const decoded = decodeToken(token);
      set({ token, user: decoded });

      if (decoded?.role) {
        await get().fetchMe();
      }
    } catch (err) {
      console.error("Auth init error:", err);
    } finally {
      set({ initialized: true, initInProgress: false });
    }
  },

  // FORGOT PASSWORD
  forgotPassword: async (email) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/forgot-password", { email });
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false });
      throw new Error(err.response?.data?.message || "Failed to send reset code");
    }
  },

  // RESET PASSWORD
  resetPassword: async (email, otp, newPassword) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/reset-password", { email, otp, newPassword });
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false });
      throw new Error(err.response?.data?.message || "Password reset failed");
    }
  },

  isLoggedIn: () => !!get().token,
}));

export default useAuthStore;