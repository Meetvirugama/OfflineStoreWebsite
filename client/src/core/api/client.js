import axios from "axios";

/**
 * Unified API Client
 * Centralizes endpoint configuration and base request logic.
 */
const getBaseUrl = () => {
  // 1. If we are on localhost, ALWAYS try local backend first unless explicitly forced otherwise
  const isLocalhost = window.location.host.includes("localhost") || window.location.host.includes("127.0.0.1");
  
  if (isLocalhost) {
    return "http://localhost:5001/api";
  }

  // 2. Fallback to env URL (for production or custom staging)
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  
  // 3. Fallback for Render sub-pathing
  return "/api";
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
