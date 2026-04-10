import { create } from "zustand";
import * as notificationService from "../api/notification.service.js";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await notificationService.fetchNotifications();
      // interceptor auto-flattens: res is the array directly
      set({ notifications: Array.isArray(res) ? res : [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  openNotification: async (id) => {
    try {
      await notificationService.markAsRead(id);
      set({
        notifications: get().notifications.map(n =>
          n.id === id ? { ...n, is_read: true } : n
        )
      });
    } catch (err) {
      console.error(err);
    }
  },

  clickNotification: (id) => {
    // This is for UI tracking, can be used to set active notif
    set({
      notifications: get().notifications.map(n =>
        n.id === id ? { ...n, is_opened: true } : n
      )
    });
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllRead();
      set({
        notifications: get().notifications.map(n => ({ ...n, is_read: true, is_opened: true }))
      });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  },

  deleteNotification: async (id) => {
    try {
      await notificationService.removeNotification(id);
      set({
        notifications: get().notifications.filter(n => n.id !== id)
      });
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  }
}));

export default useNotificationStore;
