import * as aiService from "./ai.service.js";
import * as aiUtils from "./ai.utils.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { sendResponse } from "../../utils/response.js";

/**
 * POST /ai/advisory
 */
export const getCropAdvisory = asyncHandler(async (req, res) => {
    const { crop, stage, weather } = req.body;
    
    // 1. Apply backend rules
    const rules = aiUtils.applyAdvisoryRules(weather);
    
    // 2. Generate AI advice
    const advice = await aiService.getAdvisoryAI(crop, stage, weather, rules);
    
    sendResponse(res, 200, "Crop advisory generated successfully", { advice });
});

/**
 * POST /ai/disease
 */
export const getPestDiseaseInsight = asyncHandler(async (req, res) => {
    const { crop, disease } = req.body;
    
    const insight = await aiService.getDiseaseInsightAI(crop, disease);
    
    sendResponse(res, 200, "Disease insight generated successfully", insight);
});

/**
 * POST /ai/chat
 */
export const getFarmerChat = asyncHandler(async (req, res) => {
    const { message } = req.body;
    
    const response = await aiService.getChatResponseAI(message);
    
    sendResponse(res, 200, "Chat response generated successfully", { response });
});
