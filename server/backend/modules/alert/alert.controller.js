import * as alertService from "./alert.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const create = asyncHandler(async (req, res) => {
    const result = await alertService.setAlert(req.user.id, req.body);
    sendResponse(res, 201, "Price alert set", result);
});

export const list = asyncHandler(async (req, res) => {
    const result = await alertService.getMyAlerts(req.user.id);
    sendResponse(res, 200, "Your alerts fetched", result);
});

export const remove = asyncHandler(async (req, res) => {
    await alertService.deleteAlert(req.user.id, req.params.id);
    sendResponse(res, 200, "Alert deleted");
});
