import apiClient from "../../../core/api/client.js";

/**
 * Admin Reporting Feature Service
 */
export const fetchAllReports = () => apiClient.get("/reports");
export const fetchSalesReport = (start, end) => apiClient.get("/reports/sales", { params: { start, end } });
export const fetchInventoryReport = () => apiClient.get("/reports/inventory");
