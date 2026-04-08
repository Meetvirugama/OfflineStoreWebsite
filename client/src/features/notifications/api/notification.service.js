import apiClient from "../../../core/api/client.js";

/**
 * Notification Feature Service
 */
export const fetchNotifications = () => apiClient.get("/notifications");
export const markAsRead = (id) => apiClient.put(`/notifications/${id}/read`);
export const removeNotification = (id) => apiClient.delete(`/notifications/${id}`);
