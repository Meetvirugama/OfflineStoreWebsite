import * as pestService from './pest.service.js';
import { sendResponse } from '../../utils/response.js';
import { asyncHandler } from '../../utils/errorHandler.js';

/**
 * PATH: POST /api/pest/detect
 */
export const detectPest = asyncHandler(async (req, res) => {
    const { crop } = req.body;
    const file = req.file;

    if (!file) {
        return sendResponse(res, 400, "Image capture is mandatory for AI diagnosis.");
    }

    if (!crop) {
        return sendResponse(res, 400, "Specify the crop type for accurate results.");
    }

    // Pass to service for identifying disease via HF and enriching with Agri-Intelligence
    const userId = req.user?.id || null;
    const result = await pestService.detectAndEnrich(userId, crop, file.path);

    sendResponse(res, 201, "AI Diagnostic successfully generated.", result);
});

/**
 * PATH: GET /api/pest/history
 */
export const getHistory = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return sendResponse(res, 200, "Local guest history", []);
    }
    const result = await pestService.getHistory(userId);
    sendResponse(res, 200, "Diagnostic history fetched.", result);
});
