import apiClient from "../../../core/api/client.js";

/**
 * Product Feature Service
 */
export const fetchAll = () => apiClient.get("/products");
export const fetchById = (id) => apiClient.get(`/products/${id}`);
export const fetchLowStock = () => apiClient.get("/products/low-stock");
export const create = (data) => apiClient.post("/products", data);
export const updateStock = (data) => apiClient.post("/products/stock", data);
