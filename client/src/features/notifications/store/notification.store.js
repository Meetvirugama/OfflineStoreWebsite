import { create } from "zustand";
import * as notificationService from "../api/notification.service.js";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await notificationService.fetchNotifications();
      set({ notifications: res.data || [], loading: false });
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
  }
}));

export default useNotificationStore;
