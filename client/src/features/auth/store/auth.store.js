import { create } from "zustand";
import * as authService from "../api/auth.service.js";

const decodeToken = (t) => {
  try { return JSON.parse(atob(t.split('.')[1])); } catch { return null; }
};

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("agromart_token") || null,
  user: decodeToken(localStorage.getItem("agromart_token")) || null,
  profile: null,
  customer: null,
  loading: false,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await authService.login({ email, password });
      
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
      await authService.register(data);
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
      await authService.verifyOtp({ email, otp });
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  resendOtp: async (email) => {
    set({ loading: true });
    try {
      await authService.resendOtp({ email });
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  fetchProfile: async () => {
    try {
      const res = await apiClient.get("/users/profile");
      const userData = res.data; // res is { success, message, data }
      set({ 
        profile: userData, 
        customer: userData?.Customer || userData, // Fallback to user if no Customer linked
        initialized: true 
      });
      return userData;
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
    set({ token: null, user: null, profile: null, customer: null });
  },

  updateProfile: async (formData) => {
    set({ loading: true });
    try {
      const res = await apiClient.put("/users/profile", formData);
      const userData = res.data;
      set({ 
        profile: userData, 
        customer: userData?.Customer || userData,
        loading: false 
      });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  }
}));

export default useAuthStore;
