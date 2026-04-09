import { create } from "zustand";
import apiClient from "../../../core/api/client.js";

const decodeToken = (t) => {
  try { return JSON.parse(atob(t.split('.')[1])); } catch { return null; }
};

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("agromart_token") || null,
  user: decodeToken(localStorage.getItem("agromart_token")) || null,
  profile: null,
  loading: false,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      
      // Unwrapping backend standard response { success, message, data: { token, user } }
      const { token, user: userData } = res.data;
      
      localStorage.setItem("agromart_token", token);
      const decoded = decodeToken(token);
      set({ token, user: decoded || userData, loading: false });
      if (decoded?.role) await get().fetchProfile();
      return { success: true };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      await apiClient.post("/auth/register", data);
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  verifyOtp: async (email, otp) => {
    set({ loading: true });
    try {
      await apiClient.post("/auth/verify-otp", { email, otp });
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  fetchProfile: async () => {
    try {
      const data = await apiClient.get("/users/profile");
      set({ profile: data, initialized: true });
      return data;
    } catch (err) {
      set({ initialized: true });
      return null;
    }
  },

  init: async () => {
    if (get().initialized) return;
    const token = localStorage.getItem("agromart_token");
    if (!token) {
      set({ initialized: true });
      return;
    }
    const decoded = decodeToken(token);
    set({ token, user: decoded });
    if (decoded?.role) await get().fetchProfile();
    set({ initialized: true });
  },

  logout: async () => {
    localStorage.removeItem("agromart_token");
    set({ token: null, user: null, profile: null });
  }
}));

export default useAuthStore;
