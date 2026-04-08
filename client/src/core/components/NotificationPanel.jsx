import { useEffect } from "react";
import useNotificationStore from "../../store/notificationStore";
import "@/styles/notification.css";

export default function NotificationPanel() {
  const {
    notifications,
    fetchNotifications,
    openNotification,
    clickNotification,
    markAllAsRead,
    deleteNotification
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.is_opened).length;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `Just now`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notif-panel">
      <div className="notif-header">
        <h3 className="notif-title">Notifications</h3>
        {unreadCount > 0 && <span className="notif-header-badge">{unreadCount} New</span>}
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <div className="notif-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            <p>You’re all caught up!</p>
            <span>No new notifications</span>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${n.is_opened ? "opened" : "unread"}`}
              onClick={() => {
                openNotification(n.id);
                clickNotification(n.id);
              }}
            >
              <div className="notif-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <div className="notif-content">
                <p className="notif-message">{n.message}</p>
                <div className="notif-meta">
                  <span className="notif-time">{formatTime(n.created_at)}</span>
                  {!n.is_opened && <div className="unread-dot"></div>}
                </div>
              </div>

              {/* DELETE BUTTON */}
              <button
                className="notif-delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Don't trigger the "open" click
                  deleteNotification(n.id);
                }}
                title="Delete notification"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && unreadCount > 0 && (
        <div className="notif-footer">
          <button className="notif-mark-all" onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}>
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}