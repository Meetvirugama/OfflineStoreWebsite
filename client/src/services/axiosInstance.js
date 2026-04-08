import axios from "axios";
import useUIStore from "../store/uiStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});

// Request interceptor – attach JWT token & Start Loading
api.interceptors.request.use((config) => {
  useUIStore.getState().startLoading();
  const token = localStorage.getItem("agromart_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – handle items & Stop Loading
api.interceptors.response.use(
  (res) => {
    useUIStore.getState().stopLoading();
    return res;
  },
  (err) => {
    useUIStore.getState().stopLoading();
    if (err.response?.status === 401) {
      localStorage.removeItem("agromart_token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);

export default api;
