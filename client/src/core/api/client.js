import axios from "axios";

/**
 * Unified API Client
 * Centralizes endpoint configuration and base request logic.
 */
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  
  // Auto-detect production protocol if on HTTPS but no URL provided
  if (window.location.protocol === "https:" && !window.location.host.includes("localhost")) {
    console.warn("⚠️ VITE_API_URL missing in production. Frontend might fail to connect to Backend.");
  }
  
  return "http://localhost:5001/api";
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (e.g., for Authorization)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("agromart_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (e.g., for error handling)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
