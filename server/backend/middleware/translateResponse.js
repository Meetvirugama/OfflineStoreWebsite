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
 * RECURSIVE TRANSLATION ENGINE (Memory-Safe Version)
 * @param {any} value - The data to translate
 * @param {string} key - Current JSON key
 * @param {string} targetLang - Language code
 * @param {number} depth - Recursion depth to prevent stack overflow
 * @param {WeakSet} visited - Tracking for circular reference protection
 */
const processValue = async (value, key, targetLang, depth = 0, visited = new WeakSet()) => {
    // 1. Base Safety Guards
    if (value === null || value === undefined) return value;
    if (targetLang === 'en') return value;
    if (depth > 5) return value; // Prevent deep nesting memory blowup

    // 2. Circular Reference Prevention
    if (typeof value === 'object' && value !== null) {
        if (visited.has(value)) return value;
        visited.add(value);
    }

    // 3. Handle Arrays (e.g., News feeds)
    if (Array.isArray(value)) {
        // Limit processing for massive arrays to avoid heap bloat
        const limitedArray = value.slice(0, 50); 
        return await Promise.all(limitedArray.map(item => processValue(item, key, targetLang, depth + 1, visited)));
    }

    // 4. Handle Objects
    if (typeof value === 'object' && value !== null) {
        const processedObj = {};
        for (const [k, v] of Object.entries(value)) {
            const lowKey = k.toLowerCase();
            // Critical: Skip technical / metadata keys
            if (EXCLUDED_KEYS.has(lowKey) || lowKey.includes('id') || lowKey.includes('at') || lowKey.includes('url')) {
                processedObj[k] = v;
            } else {
                processedObj[k] = await processValue(v, k, targetLang, depth + 1, visited);
            }
        }
        return processedObj;
    }

    // 5. Handle Strings (The actual translation step)
    if (typeof value === 'string') {
        // Additional Safety: Don't translate very short strings or numeric strings
        if (value.length < 2 || /^\d+$/.test(value)) return value;
        return await translateText(value, targetLang);
    }

    return value;
};

/**
 * PRODUCTION TRANSLATION MIDDLEWARE
 * Overrides res.json to dynamically translate descriptive fields
 */
const translateResponse = async (req, res, next) => {
    // 1. Identify Target Language (Multi-Source Detection for Robustness)
    const lang = (
        req.headers['x-lang'] || 
        req.headers['lang'] || 
        req.query.lang || 
        req.cookies?.lang || 
        'en'
    ).toLowerCase();
    
    // Validate language selection
    const targetLang = ['en', 'gu'].includes(lang) ? lang : 'en';

    // Production Debug Pulse: Verify if the system sees your choice
    if (targetLang !== 'en') {
        console.log(`[LOCALIZATION] 🌐 Target: ${targetLang.toUpperCase()} | Path: ${req.path}`);
    }

    // 2. Skip logic if target is English
    if (targetLang === 'en') return next();

    // 3. SAFE INTERCEPTION PATTERN
    // Logic: Intercept 'res.json', perform async translation, then call original 'res.json'.
    const originalJson = res.json;

    res.json = function (body) {
        // Prevent recursive calls
        res.json = originalJson;

        // Perform translation in a self-contained async scope
        processValue(body, null, targetLang)
            .then(translatedBody => {
                // Return to the original JSON flow with translated data
                return originalJson.call(this, translatedBody);
            })
            .catch(error => {
                console.error('[TRANSLATE MIDDLEWARE ERROR]', error);
                // Resilient fallback: send original body if translation fails
                return originalJson.call(this, body);
            });

        return this; // res.json is chainable in Express
    };

    next();
};

export default translateResponse;
