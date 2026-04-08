import * as orderService from "./order.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const checkout = asyncHandler(async (req, res) => {
    const result = await orderService.createFromCart(req.user.id);
    sendResponse(res, 201, "Order placed successfully", result);
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getUserOrders(req.user.id);
    sendResponse(res, 200, "Orders fetched", result);
});

export const getOrderDetails = asyncHandler(async (req, res) => {
    // Logic for single order details
    sendResponse(res, 200, "Order details coming soon");
});
