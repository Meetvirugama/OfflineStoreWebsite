import { create } from "zustand";
import * as productService from "../api/product.service.js";

const useProductStore = create((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const data = await productService.fetchAll();
      set({ products: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  }
}));

export default useProductStore;
