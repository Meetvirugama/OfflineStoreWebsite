import express from 'express';
import * as translationController from './translation.controller.js';

const router = express.Router();

/**
 * PRODUCTION-GRADE TRANSLATION API (Manual Endpoint)
 * Use case: Frontend DynText wrappers or manual translation triggers
 */
router.post('/', translationController.translate);

export default router;
