import API from "./axios";

// 🌍 PUBLIC
export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);

// 🔒 ADMIN
export const createProduct = (data) => API.post("/products", data);

// 🔒 STOCK
export const getStock = (id) => API.get(`/products/stock/${id}`);
export const getLowStock = () => API.get("/products/low-stock");