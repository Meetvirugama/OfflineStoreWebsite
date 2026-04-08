import Notification from "./notification.model.js";

export const notify = async (userId, title, message, type = "INFO") => {
    return await Notification.create({
        user_id: userId,
        title,
        message,
        type
    });
};

export const getMyNotifications = async (userId) => {
    return await Notification.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]]
    });
};

export const markAsRead = async (notificationId) => {
    const notification = await Notification.findByPk(notificationId);
    if (notification) await notification.update({ is_read: true });
};
