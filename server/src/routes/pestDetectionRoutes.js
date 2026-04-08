import express from 'express';
import * as pestController from '../controllers/pestDetectionController.js';
import { uploadDiseaseImage } from '../middlewares/upload.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/pest/detect
 * @desc    Upload image and get AI diagnosis
 * @access  Private
 */
router.post('/detect', 
    authMiddleware, 
    uploadDiseaseImage.single('images'), 
    pestController.detectPest
);

/**
 * @route   GET /api/pest/history
 * @desc    Get user diagnostic history
 * @access  Private
 */
router.get('/history', 
    authMiddleware, 
    pestController.getHistory
);

export default router;
