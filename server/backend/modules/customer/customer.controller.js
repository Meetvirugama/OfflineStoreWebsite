import * as customerService from "./customer.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const create = asyncHandler(async (req, res) => {
    const result = await customerService.createCustomer(req.body);
    sendResponse(res, 201, "Customer created", result);
});

export const list = asyncHandler(async (req, res) => {
    const result = await customerService.getCustomers();
    sendResponse(res, 200, "Customer list fetched", result);
});

export const get = asyncHandler(async (req, res) => {
    const result = await customerService.getCustomerById(req.params.id);
    if (!result) return sendResponse(res, 404, "Customer not found");
    sendResponse(res, 200, "Customer details", result);
});

export const update = asyncHandler(async (req, res) => {
    const result = await customerService.updateCustomer(req.params.id, req.body);
    sendResponse(res, 200, "Customer updated", result);
});

export const remove = asyncHandler(async (req, res) => {
    await customerService.deleteCustomer(req.params.id);
    sendResponse(res, 200, "Customer deleted");
});
