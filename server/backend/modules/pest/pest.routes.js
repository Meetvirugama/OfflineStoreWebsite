import express from 'express';
import multer from 'multer';
import path from 'path';
import * as pestController from './pest.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Configuration for local image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/backend/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * PRODUCTION-GRADE DIAGNOSTICS:
 * 1. POST /detect - Trigger AI Vision logic
 * 2. GET /history - Fetch user records
 */
router.post('/detect', upload.single('image'), pestController.detectPest);
router.get('/history', protect, pestController.getHistory);

export default router;
