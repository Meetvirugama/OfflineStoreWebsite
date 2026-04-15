import * as notificationService from "./notification.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const getMy = asyncHandler(async (req, res) => {
    const result = await notificationService.getMyNotifications(req.user.id);
    sendResponse(res, 200, "Notifications fetched", result);
});

export const read = asyncHandler(async (req, res) => {
    await notificationService.markAsRead(req.params.id);
    sendResponse(res, 200, "Notification marked as read");
});

export const markAllRead = asyncHandler(async (req, res) => {
    await notificationService.markAllRead(req.user.id);
    sendResponse(res, 200, "All notifications marked as read");
});

export const remove = asyncHandler(async (req, res) => {
    await notificationService.deleteNotification(req.params.id, req.user.id);
    sendResponse(res, 200, "Notification removed");
});

export const remind = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { orderServ, userServ, notifyServ, emailServ } = {
        orderServ: await import("../order/order.service.js"),
        userServ: await import("../user/user.model.js"),
        notifyServ: await import("./notification.service.js"),
        emailServ: await import("../../utils/email.js")
    };

    const order = await orderServ.getOrderById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const customer = order.Customer;
    const user = customer.User;

    await notifyServ.notify(user.id, "Payment Reminder 📥", `Your payment for order #${order.id} is pending.`, "WARNING");
    
    sendResponse(res, 200, "Payment reminder dispatched successfully");
});
