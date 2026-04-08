import * as paymentService from "./payment.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const verify = asyncHandler(async (req, res) => {
    const { orderId, amount, transactionId } = req.body;
    const result = await paymentService.createPayment(orderId, req.user.id, amount, transactionId);
    sendResponse(res, 201, "Payment verified and order completed", result);
});

export const getMyPayments = asyncHandler(async (req, res) => {
    const result = await paymentService.getHistory(req.user.id);
    sendResponse(res, 200, "Payment history fetched", result);
});
