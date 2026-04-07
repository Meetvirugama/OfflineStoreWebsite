import { create } from "zustand";
import api from "../services/axiosInstance";

const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  discount: 0,
  final: 0,
  open: false,
  loading: false,

  setDrawerOpen: (open) => set({ open }),

  // FETCH CART
  fetchCart: async (customerId) => {
    if (!customerId) return;
    set({ loading: true });
    try {
      const res = await api.get(`/cart/${customerId}`);
      set({
        items: res.data.items || [],
        total: res.data.total || 0,
        discount: res.data.discount || 0,
        final: res.data.final || 0,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  // ADD TO CART
  addToCart: async (customerId, productId, quantity = 1) => {
    try {
      await api.post("/cart/add", {
        customer_id: customerId,
        product_id: productId,
        quantity,
      });
      await get().fetchCart(customerId);
      set({ open: true });
      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to add to cart");
    }
  },

  // UPDATE QTY
  updateQty: async (itemId, quantity, customerId) => {
    if (quantity < 1) {
      await get().removeItem(itemId, customerId);
      return;
    }
    try {
      await api.put(`/cart/${itemId}`, { quantity });
      await get().fetchCart(customerId);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Update failed");
    }
  },

  // 🔥 FIX: Use DELETE /cart/:id instead of PUT with qty=0
  removeItem: async (itemId, customerId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await get().fetchCart(customerId);
    } catch {
      throw new Error("Failed to remove item");
    }
  },

  // CHECKOUT
  checkout: async (customerId, createdBy) => {
    set({ loading: true });
    try {
      const res = await api.post("/cart/checkout", {
        customer_id: customerId,
        created_by: createdBy,
      });
      set({ items: [], total: 0, discount: 0, final: 0, loading: false, open: false });
      return res.data;
    } catch (err) {
      set({ loading: false });
      throw new Error(err.response?.data?.message || "Checkout failed");
    }
  },

  clearCart: () => set({ items: [], total: 0, discount: 0, final: 0 }),

  cartCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

export default useCartStore;