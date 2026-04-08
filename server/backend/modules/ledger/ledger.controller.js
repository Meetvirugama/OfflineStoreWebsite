import * as ledgerService from "./ledger.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const getMyLedger = asyncHandler(async (req, res) => {
    const result = await ledgerService.getUserLedger(req.user.id);
    sendResponse(res, 200, "Ledger fetched", result);
});

export const getSummary = asyncHandler(async (req, res) => {
    // Logic for financial summary
    sendResponse(res, 200, "Summary coming soon");
});
