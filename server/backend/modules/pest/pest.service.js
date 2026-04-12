import axios from 'axios';
import fs from 'fs';
import PestDetection from './pest.model.js';
import * as aiService from '../ai/ai.service.js';
import { ENV } from '../../config/env.js';

const HF_MODEL = "google/vit-base-patch16-224";
const HF_TOKEN = ENV.HF_TOKEN;
if (!HF_TOKEN) {
    console.error("❌ [AI] HF_TOKEN is missing in environment variables.");
}

/**
 * AI CORE: Identify disease from image and enrich with Agri-Intelligence
 */
export const detectAndEnrich = async (userId, crop, filePath) => {
    try {
        // 1. Read Image Buffer
        const imageBuffer = fs.readFileSync(filePath);

        // 2. Call HuggingFace Inference API
        console.log(`[AI] Dispatching image to HuggingFace (${HF_MODEL})...`);
        const hfResponse = await axios.post(
            `https://api-inference.huggingface.co/models/${HF_MODEL}`,
            imageBuffer,
            {
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/octet-stream"
                }
            }
        );

        const predictions = hfResponse.data;
        if (!predictions || predictions.length === 0) {
            throw new Error("AI model failed to return visual labels.");
        }

        // Top prediction
        const topLabel = predictions[0].label;
        const confidence = (predictions[0].score * 100).toFixed(2);

        // 3. Enrich with Groq (Translate visual labels to professional Agricultural insight)
        // We use the Llama-3 model to understand what the ViT label means in a farming context
        const diagnosticReport = await aiService.getDiseaseInsightAI(crop, topLabel);

        // 4. Persistence
        const detection = await PestDetection.create({
            user_id: userId,
            crop: crop,
            disease: topLabel.split(',')[0], // Primary label
            confidence: confidence,
            treatment: diagnosticReport.treatment,
            image_url: `/uploads/${filePath.split('/').pop()}`, 
            ai_notes: `Cause: ${diagnosticReport.cause}. Prevention: ${diagnosticReport.prevention}`
        });

        return {
            disease: detection.disease,
            confidence: detection.confidence,
            severity: detection.confidence > 80 ? 'High' : (detection.confidence > 50 ? 'Medium' : 'Low'),
            treatment: detection.treatment,
            organic_prevention: diagnosticReport.prevention,
            notes: detection.ai_notes,
            image_url: detection.image_url
        };

    } catch (err) {
        console.error("[PEST SERVICE ERROR]", err.message);
        throw new Error(err.response?.data?.error || "AI Diagnostic timeout. Please try again with a clearer image.");
    }
};

/**
 * HISTORY: Fetch user detection records
 */
export const getHistory = async (userId) => {
    return await PestDetection.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']]
    });
};
