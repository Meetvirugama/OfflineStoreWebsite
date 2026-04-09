import { create } from "zustand";
import * as checkoutService from "../api/checkout.service.js";

const useCartStore = create((set, get) => ({
  cartId: null,
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await checkoutService.fetchCart();
      const { cartId, items } = res.data || { cartId: null, items: [] };
      set({ cartId, items, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      await checkoutService.addToCart({ productId, quantity });
      await get().fetchCart();
    } catch (err) {
      throw err;
    }
  },

  removeItem: async (id) => {
    try {
      await checkoutService.removeCartItem(id);
      await get().fetchCart();
    } catch (err) {
      throw err;
    }
  },

  clearCart: async () => {
    try {
      await checkoutService.clearCart();
      set({ items: [], cartId: null });
    } catch (err) {
      throw err;
    }
  }
}));

export default useCartStore;
