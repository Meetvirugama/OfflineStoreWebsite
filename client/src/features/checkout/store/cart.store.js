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
      const { cartId, items: rawItems } = res.data || { cartId: null, items: [] };
      
      // Flatten items: map item.Product.name -> item.name
      const items = (rawItems || []).map(item => ({
        id: item.id,
        productId: item.Product?.id,
        name: item.Product?.name || "Premium Supply",
        price: item.Product?.selling_price || 0,
        mrp: item.Product?.mrp || item.Product?.selling_price || 0,
        image: item.Product?.image,
        quantity: item.quantity,
        final: (item.Product?.selling_price || 0) * item.quantity,
        discount: ((item.Product?.mrp || 0) - (item.Product?.selling_price || 0)) * item.quantity
      }));
      
      const subtotal = items.reduce((sum, i) => sum + i.final, 0);
      const totalDiscount = items.reduce((sum, i) => sum + (i.discount > 0 ? i.discount : 0), 0);
      
      set({ 
        cartId, 
        items, 
        total: subtotal,
        discount: totalDiscount,
        final: subtotal,
        loading: false 
      });
    } catch (err) {
      console.error("Fetch cart error:", err);
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      set({ loading: true });
      await checkoutService.addToCart({ productId, quantity });
      await get().fetchCart();
      set({ open: true, loading: false }); 
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  updateQty: async (cartItemId, newQty) => {
    if (newQty < 1) return;
    set({ loading: true });
    try {
      await checkoutService.updateCartItemQty(cartItemId, newQty);
      await get().fetchCart();
    } catch (err) {
      set({ loading: false });
      console.error("Update quantity error:", err);
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

  checkout: async (customerId) => {
    set({ loading: true });
    try {
      const res = await checkoutService.placeOrder(customerId);
      // Backend returns { success: true, message: '...', data: order }
      const orderData = res.data; 
      
      // Clear local cart state only after successful order creation
      set({ 
        items: [], 
        cartId: null, 
        total: 0, 
        discount: 0, 
        final: 0, 
        open: false,
        loading: false 
      });
      
      return orderData;
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
