import axios from "./axiosInstance";

export const getNotifications = () =>
  axios.get("/notifications");

export const markOpen = (id) =>
  axios.put(`/notifications/${id}/open`);

export const markClick = (id) =>
  axios.put(`/notifications/${id}/click`);

export const getNotificationAnalytics = () =>
  axios.get("/notifications/analytics");