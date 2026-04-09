import * as orderService from "./order.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const checkout = asyncHandler(async (req, res) => {
    const { customerId } = req.body;
    const result = await orderService.createFromCart(req.user.id, customerId);
    sendResponse(res, 201, "Order placed successfully", result);
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getUserOrders(req.user.id);
    sendResponse(res, 200, "Orders fetched", result);
});

export const listAllOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getAllOrders();
    sendResponse(res, 200, "All orders fetched", result);
});

export const updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await orderService.updateOrderStatus(id, status);
    sendResponse(res, 200, "Order status updated", result);
});

export const getOrderDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Logic for single order details
    sendResponse(res, 200, "Order details logic to be expanded as needed");
});
