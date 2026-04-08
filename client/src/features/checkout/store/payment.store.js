import { create } from "zustand";
import * as checkoutService from "../api/checkout.service.js";

const usePaymentStore = create((set) => ({
  loading: false,

  createOrder: async (orderId, amount) => {
    set({ loading: true });
    try {
      const data = await checkoutService.placeOrder(orderId, amount);
      set({ loading: false });
      return data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  verify: async (payload) => {
    set({ loading: true });
    try {
      const data = await checkoutService.verifyPayment(payload);
      set({ loading: false });
      return data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  }
}));

export default usePaymentStore;
