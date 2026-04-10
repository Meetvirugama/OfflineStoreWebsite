import apiClient from "../../../core/api/client.js";

/**
 * Checkout & Cart Feature Service
 */
export const fetchCart = () => apiClient.get("/cart");
export const addToCart = (data) => apiClient.post("/cart/add", data);
export const updateCartItemQty = (id, quantity) => apiClient.patch(`/cart/${id}`, { quantity });
export const removeCartItem = (id) => apiClient.delete(`/cart/${id}`);
export const clearCart = () => apiClient.delete("/cart");

export const placeOrder = (customerId) => apiClient.post("/orders/checkout", { customerId });
export const fetchMyOrders = () => apiClient.get("/orders/my");

export const verifyPayment = (data) => apiClient.post("/payments/verify", data);
