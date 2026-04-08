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
