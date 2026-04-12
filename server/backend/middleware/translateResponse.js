import { translateText } from '../utils/translate.js';

// SECURE EXCLUSION LIST: Keys that must NEVER be translated
const EXCLUDED_KEYS = new Set([
    'id', '_id', 'user_id', 'customer_id', 'product_id', 'order_id',
    'price', 'amount', 'total', 'subtotal', 'discount',
    'email', 'mobile', 'phone', 'contact',
    'created_at', 'updated_at', 'date', 'timestamp',
    'invoice_number', 'sku', 'status', 'unit',
    'commodity', 'market', 'crop', 'apmc', 'district', 'state', // Agri Logic
    'category', 'location', 'lat', 'lng', // Technical Locality
    'icon', 'color', 'image', 'url', 'link' // UI Technicals
]);

/**
 * RECURSIVE TRANSLATION ENGINE
 */
const processValue = async (value, key, targetLang) => {
    // 1. Skip if value is not exist or lang is English
    if (value === null || value === undefined) return value;
    if (targetLang === 'en') return value;

    // 2. Handle Arrays
    if (Array.isArray(value)) {
        return await Promise.all(value.map(item => processValue(item, key, targetLang)));
    }

    // 3. Handle Objects
    if (typeof value === 'object' && value !== null) {
        const processedObj = {};
        for (const [k, v] of Object.entries(value)) {
            // Check exclusion list for keys
            if (EXCLUDED_KEYS.has(k.toLowerCase())) {
                processedObj[k] = v;
            } else {
                processedObj[k] = await processValue(v, k, targetLang);
            }
        }
        return processedObj;
    }

    // 4. Handle Strings (The actual translation step)
    if (typeof value === 'string') {
        return await translateText(value, targetLang);
    }

    // 5. Fallback for primitives (Numbers, Booleans)
    return value;
};

/**
 * PRODUCTION TRANSLATION MIDDLEWARE
 * Overrides res.json to dynamically translate descriptive fields
 */
const translateResponse = async (req, res, next) => {
    // 1. Identify Target Language
    const lang = (req.headers['x-lang'] || req.query.lang || 'en').toLowerCase();
    
    // Validate language selection
    const targetLang = ['en', 'gu'].includes(lang) ? lang : 'en';

    // 2. Skip logic if target is English
    if (targetLang === 'en') return next();

    // 3. Override res.json
    const originalJson = res.json;

    res.json = async function (body) {
        try {
            // Handle if body is an envelope { success: true, data: ... }
            if (body && typeof body === 'object' && 'data' in body) {
                const translatedData = await processValue(body.data, null, targetLang);
                return originalJson.call(this, { ...body, data: translatedData });
            }

            // Direct object/array response
            const translatedBody = await processValue(body, null, targetLang);
            return originalJson.call(this, translatedBody);
        } catch (error) {
            console.error('[TRANSLATE MIDDLEWARE ERROR]', error);
            // Fallback: Always return original body to prevent breaking the API
            return originalJson.call(this, body);
        }
    };

    next();
};

export default translateResponse;
