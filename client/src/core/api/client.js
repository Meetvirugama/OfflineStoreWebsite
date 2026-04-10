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
  const baseUrl = envUrl || "https://offlinestorewebsite.onrender.com/api";
  
  if (typeof window !== "undefined") {
    console.log("🌾 [AgroMart] API Base URL:", baseUrl);
  }
  
  return baseUrl;
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

// Response Interceptor — auto-flatten the backend envelope
// Backend always sends: { success: bool, message: string, data: <payload> }
// Returning response.data.data gives stores the payload directly.
// Falls back to response.data for endpoints that don't follow the envelope pattern.
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    // Standard envelope: { success: true, message: "...", data: result }
    if (body && typeof body === "object" && body.success === true && "data" in body) {
      return body.data;
    }
    // If not standard, but success is true, return the whole body as a fallback
    if (body && typeof body === "object" && body.success === true) {
      return body;
    }
    return body;
  },
  (error) => {
    console.error("─── [API ERROR] ───");
    console.error("Path:", error.config?.url);
    console.error("Status:", error.response?.status);
    
    let message = "Something went wrong";
    
    if (error.code === "ERR_NETWORK") {
      message = "🌐 Backend is starting up or unreachable. Please refresh in 30 seconds.";
      console.warn("TIP: Check if Render 'DATABASE_URL' is set and 'Save' was clicked.");
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
