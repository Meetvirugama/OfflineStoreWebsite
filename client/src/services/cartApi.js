import API from "./axios";

export const getCart = (customer_id) =>
  API.get(`/cart/${customer_id}`);

export const updateCartItem = (id, quantity) =>
  API.put(`/cart/${id}`, { quantity });

export const checkoutCart = (customer_id, created_by) =>
  API.post("/cart/checkout", {
    customer_id,
    created_by
  });