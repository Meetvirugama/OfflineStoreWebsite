import { create } from "zustand";
import { getProducts } from "../services/productApi";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });

    try {
      const res = await getProducts();
      set({ products: res.data });
    } catch (err) {
      // Error handled by store listener or component
    } finally {
      set({ loading: false });
    }
  },
}));