import api from "./axiosInstance";

export const createOrderApi = (order_id, amount) => {
  return api.post("/payments/create-order", {
    order_id,
    amount
  });
};

export const verifyPaymentApi = (data) => {
  return api.post("/payments/verify", data);
};

export const getPaymentsApi = (orderId) => {
  return api.get(`/payments/${orderId}`);
};