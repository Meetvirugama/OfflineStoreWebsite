import Notification from "./notification.model.js";
import User from "../user/user.model.js";
import { sendEmail, getNotificationTemplate } from "../../utils/email.js";

export const notify = async (userId, title, message, type = "INFO") => {
    const notification = await Notification.create({
        user_id: userId,
        title,
        message,
        type
    });

    // Try to send an actual email in the background
    try {
        const user = await User.findByPk(userId);
        if (user && user.email) {
            const emailHtml = getNotificationTemplate(title, message);
            await sendEmail(user.email, title, message, emailHtml);
        }
    } catch (err) {
        console.error("Delayed Email Notification Error:", err);
    }

    return notification;
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

export const markAllRead = async (userId) => {
    return await Notification.update(
        { is_read: true },
        { where: { user_id: userId, is_read: false } }
    );
};

export const deleteNotification = async (notificationId, userId) => {
    return await Notification.destroy({
        where: { id: notificationId, user_id: userId }
    });
};
