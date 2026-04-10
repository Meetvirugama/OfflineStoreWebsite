import { create } from "zustand";
import * as productService from "../api/product.service.js";

const useProductStore = create((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await productService.fetchAll();
      // interceptor auto-flattens: res is the products array directly
      set({ products: Array.isArray(res) ? res : [], loading: false });
    } catch (err) {
      set({ loading: false });
    }
  }
}));

export default useProductStore;
