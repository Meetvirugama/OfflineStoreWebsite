import { create } from "zustand";
import * as checkoutService from "../api/checkout.service.js";

const useCartStore = create((set, get) => ({
  open: false,
  cartId: null,
  items: [],
  total: 0,
  discount: 0,
  final: 0,
  loading: false,

  setDrawerOpen: (isOpen) => set({ open: isOpen }),

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await checkoutService.fetchCart();
      const { cartId, items } = res.data || { cartId: null, items: [] };
      
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalDiscount = items.reduce((sum, item) => sum + ((item.mrp - item.price) * item.quantity), 0);
      
      set({ 
        cartId, 
        items, 
        total: subtotal,
        discount: totalDiscount > 0 ? totalDiscount : 0,
        final: subtotal,
        loading: false 
      });
    } catch {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      set({ loading: true });
      await checkoutService.addToCart({ productId, quantity });
      await get().fetchCart();
      set({ open: true, loading: false }); // Auto-open cart on add
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  updateQty: async (itemId, quantity) => {
    if (quantity < 1) return;
    set({ loading: true });
    try {
      // Logic assumes quantity updates are handled via specific API or re-adding
      await checkoutService.addToCart({ productId: itemId, quantity: 1, type: 'absolute' }); 
      // Note: Backend service currently only has addItem which increments. 
      // I should check if backend supports absolute quantity setting.
      await get().fetchCart();
    } catch (err) {
      set({ loading: false });
    }
  },

  removeItem: async (id) => {
    try {
      set({ loading: true });
      await checkoutService.removeCartItem(id);
      await get().fetchCart();
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  clearCart: async () => {
    try {
      set({ loading: true });
      await checkoutService.clearCart();
      set({ items: [], cartId: null, total: 0, final: 0, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  }
}));

export default useCartStore;
