import { create } from "zustand";
import * as api from "../services/notificationApi";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    const res = await api.getNotifications();
    set({ notifications: res.data, loading: false });
  },

  openNotification: async (id) => {
    await api.markOpen(id);

    set({
      notifications: get().notifications.map(n =>
        n.id === id ? { ...n, is_opened: true } : n
      )
    });
  },

  clickNotification: async (id) => {
    await api.markClick(id);

    set({
      notifications: get().notifications.map(n =>
        n.id === id ? { ...n, is_clicked: true } : n
      )
    });
  },

  markAllAsRead: async () => {
    const unread = get().notifications.filter(n => !n.is_opened);
    if (!unread.length) return;
    
    // Call API for each to mark read
    Promise.all(unread.map(n => api.markOpen(n.id))).catch(console.error);

    set({
      notifications: get().notifications.map(n => ({ ...n, is_opened: true }))
    });
  }
}));

export default useNotificationStore;