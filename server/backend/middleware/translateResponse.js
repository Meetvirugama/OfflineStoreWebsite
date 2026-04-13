import { translateText } from '../utils/translate.js';

// SECURE EXCLUSION LIST: Keys that must NEVER be translated
const EXCLUDED_KEYS = new Set([
    'id', '_id', 'user_id', 'customer_id', 'product_id', 'order_id',
    'price', 'amount', 'total', 'subtotal', 'discount',
    'email', 'mobile', 'phone', 'contact',
    'created_at', 'updated_at', 'date', 'timestamp',
    'invoice_number', 'sku', 'status', 'unit',
    // 'commodity', 'market', 'crop', 'apmc', 'district', 'state' - MOVED TO PRIORITY
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
    if (depth > 6) return value; // Slightly deeper for nested news lists

    // 2. Normalize: Unpack Sequelize Models or Class Instances to Plain Objects
    let normalizedValue = value;
    if (typeof value === 'object' && value !== null) {
        if (typeof value.toJSON === 'function') {
            normalizedValue = value.toJSON();
        } else if (value.dataValues) {
            normalizedValue = value.dataValues;
        }
    }

    // 3. Circular Reference Prevention
    if (typeof normalizedValue === 'object' && normalizedValue !== null) {
        if (visited.has(normalizedValue)) return normalizedValue;
        visited.add(normalizedValue);
    }

    // 4. Handle Arrays (e.g., News feeds)
    if (Array.isArray(normalizedValue)) {
        const limitedArray = normalizedValue.slice(0, 30); // Leaner limit for news stability
        
        // 🚀 SMART THROTTLING (Sequential Processing)
        // Instead of processing 40+ items all at once (which triggers Rate Limits),
        // we process them one-by-one to ensure high success rate.
        const processedArray = [];
        for (const item of limitedArray) {
            processedArray.push(await processValue(item, key, targetLang, depth + 1, visited));
        }
        return processedArray;
    }

    // 5. Handle Objects
    if (typeof normalizedValue === 'object' && normalizedValue !== null) {
        const processedObj = {};
        for (const [k, v] of Object.entries(normalizedValue)) {
            const lowKey = k.toLowerCase();
            
            // PRIORITY KEYS: Always translate these regardless of depth
            const PRIORITY_KEYS = [
                'title', 'description', 'message', 'name', 'commodity', 'market', 'market_name',
                'crop', 'crop_name', 'apmc', 'district', 'state', 'variety', 'mandi', 'type',
                'disease_name', 'severity', 'solution', 'organic_solution', 'outlook', 
                'ai_recommendation', 'season', 'stage', 'diagnosis', 'remedy', 'symptoms', 
                'suggestion', 'ai_text', 'best_mandi_reason', 'risks_raw', 'outlook_type', 'velocity'
            ];
            if (PRIORITY_KEYS.includes(lowKey)) {
                processedObj[k] = await processValue(v, k, targetLang, depth + 1, visited);
                continue;
            }

            // EXCLUSION LOGIC: Skip technical / metadata keys
            if (EXCLUDED_KEYS.has(lowKey) || lowKey.includes('id') || lowKey.includes('at') || lowKey.includes('url')) {
                processedObj[k] = v;
            } else {
                processedObj[k] = await processValue(v, k, targetLang, depth + 1, visited);
            }
        }
        return processedObj;
    }

    // 6. Handle Strings (The actual translation step)
    if (typeof normalizedValue === 'string') {
        if (normalizedValue.length < 2 || /^\d+$/.test(normalizedValue)) return normalizedValue;
        return await translateText(normalizedValue, targetLang);
    }

    return normalizedValue;
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
