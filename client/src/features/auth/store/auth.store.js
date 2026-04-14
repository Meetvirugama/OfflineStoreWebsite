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
      // interceptor auto-flattens: res is now { token, user } directly
      const { token, user: userData } = res;
      
      localStorage.setItem("agromart_token", token);
      const decoded = decodeToken(token);
      
      // Merge decoded token info with user data from response to ensure name/email are present
      const mergedUser = { ...(userData || {}), ...(decoded || {}) };
      
      set({ token, user: mergedUser, loading: false });
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
      const res = await authService.getProfile();
      // interceptor auto-flattens: res is the profile object directly
      set({ 
        profile: res, 
        customer: res?.Customer || null,
        initialized: true 
      });
      return res;
    } catch (err) {
      set({ initialized: true });
      return null;
    }
  },

  init: async (force = false) => {
    const { initialized, token: currentToken } = get();
    const token = localStorage.getItem("agromart_token");

    // Allow re-sync if token has changed vs state, or if manually forced
    if (!force && initialized && token === currentToken) return;

    if (!token) {
      set({ token: null, user: null, profile: null, customer: null, initialized: true });
      return;
    }

    try {
      const decoded = decodeToken(token);
      set({ token, user: decoded, initialized: true });
      if (decoded?.role) await get().fetchProfile();
    } catch (err) {
      console.error("Auth init error:", err);
      set({ initialized: true });
    }
  },

  logout: async () => {
    localStorage.removeItem("agromart_token");
    set({ token: null, user: null, profile: null, customer: null });
  },

  updateProfile: async (formData) => {
    set({ loading: true });
    try {
      const res = await authService.updateProfile(formData);
      set({ 
        profile: res, 
        customer: res?.Customer || null,
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
