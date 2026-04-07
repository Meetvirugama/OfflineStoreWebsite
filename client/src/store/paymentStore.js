// src/store/paymentStore.js

import { create } from "zustand";
import { createOrderApi, verifyPaymentApi } from "../services/paymentApi";

const usePaymentStore = create((set) => ({
  loading: false,

  createOrder: async (orderId, amount) => {
    try {
      set({ loading: true });

      const res = await createOrderApi(orderId, amount);
      return res.data.data;
    } catch (err) {
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  verifyPayment: async (payload) => {
    try {
      set({ loading: true });

      const res = await verifyPaymentApi(payload);
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      set({ loading: false });
    }
  }
}));

export default usePaymentStore;