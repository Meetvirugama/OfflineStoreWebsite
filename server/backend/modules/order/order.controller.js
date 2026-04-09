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
    const order = await orderService.getOrderById(id);
    
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Security: Only Admin or the Order Owner can view details
    if (req.user.role !== "ADMIN" && order.created_by !== req.user.id) {
        return res.status(403).json({ success: false, message: "Access denied to this order" });
    }

    sendResponse(res, 200, "Order details fetched", order);
});

export const downloadInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Security: Only Admin or the Order Owner can fetch invoice
    if (req.user.role !== "ADMIN" && order.created_by !== req.user.id) {
        return res.status(403).json({ success: false, message: "Access denied to this invoice" });
    }

    const { generateInvoicePDF } = await import("../invoice/invoice.service.js");

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-order-${id}.pdf`);
    
    await generateInvoicePDF(order, res);
});
