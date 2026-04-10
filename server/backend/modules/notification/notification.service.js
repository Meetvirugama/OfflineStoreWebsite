import Notification from "./notification.model.js";
import User from "../user/user.model.js";
import { sendEmail } from "../../utils/email.js";

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
            await sendEmail(user.email, title, message, `
                <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #059669;">${title}</h2>
                    <p>${message}</p>
                    <hr />
                    <p style="font-size: 11px; color: #999;">AgroMart ERP - Smart Agriculture Network</p>
                </div>
            `);
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
