import axios from "./axiosInstance";

export const getNotifications = () =>
  axios.get("/notifications");

export const markOpen = (id) =>
  axios.put(`/notifications/${id}/open`);

export const markClick = (id) =>
  axios.put(`/notifications/${id}/click`);

export const deleteNotification = (id) =>
  axios.delete(`/notifications/${id}`);

export const getNotificationAnalytics = () =>
  axios.get("/notifications/analytics");