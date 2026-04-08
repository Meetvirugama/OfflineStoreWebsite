import * as pestService from '../services/pestDetectionService.js';
import { PestDetection } from '../models/index.js';
import path from 'path';
import fs from 'fs';

/**
 * DETECT PEST / DISEASE
 */
export const detectPest = async (req, res) => {
    const tempPath = req.file?.path;
    try {
        const { crop } = req.body;
        const userId = req.user?.id;

        if (!tempPath) {
            return res.status(400).json({ error: "Image is required for detection." });
        }

        // 1. Run AI Identification
        const aiResult = await pestService.identifyDisease(tempPath);
        
        if (!aiResult) {
            return res.status(404).json({ 
                error: "No disease detected. Please ensure you are uploading a clear photo of an infected leaf." 
            });
        }

        // 2. Fetch Localized Solutions
        const localAdvisory = pestService.getLocalizedSolution(crop, aiResult.disease);

        // 3. Prepare response & Save
        const result = {
            user_id: userId,
            crop: crop,
            image_url: `/uploads/diseases/${path.basename(tempPath)}`,
            disease_name: aiResult.disease,
            confidence: aiResult.confidence,
            solution: localAdvisory?.solution || "Verify with expert.",
            organic_solution: localAdvisory?.organic || "Verify with expert.",
            severity: localAdvisory?.severity || "Low",
        };

        const savedResult = await PestDetection.create(result);

        // Optional: delete file after upload or keep it for history
        // fs.unlinkSync(tempPath); 

        res.status(201).json({
            ...savedResult.toLocaleJSON ? savedResult.toJSON() : savedResult,
            plant: aiResult.plant,
            note: "AI-based detection. Please verify with an agricultural expert before applying chemicals."
        });

    } catch (err) {
        console.error("❌ Pest Detection Controller Error:", err.message);
        // Cleanup temp file on error
        if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        res.status(500).json({ error: err.message });
    }
};

/**
 * GET DETECTION HISTORY
 */
export const getHistory = async (req, res) => {
    try {
        const userId = req.user?.id;
        const history = await PestDetection.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            limit: 20
        });

        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
