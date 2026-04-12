import axios from 'axios';
import { ENV } from '../config/env.js';

// In-memory cache to minimize API overhead
const translationCache = new Map();

/**
 * PRODUCTION-GRADE TRANSLATION UTILITY
 * Logic: Cache-first -> API -> Fallback to original
 * Languages Supported: English (source) -> Gujarati (target)
 */
export const translateText = async (text, targetLang = 'en') => {
    // 1. Basic validation & optimization
    if (!text || typeof text !== 'string' || text.trim() === '') return text;
    if (targetLang === 'en') return text; // Default is English, no work needed
    if (targetLang !== 'gu') return text; // We strictly only support GU for now

    const cacheKey = `${text}_${targetLang}`;

    // 2. Check Hit in Cache
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }

    try {
        // 3. Dispatch to LibreTranslate
        // Timeout set to 3s to prevent API responsiveness from blocking global performance
        const apiResponse = await axios.post(ENV.TRANSLATE_API_URL, {
            q: text,
            source: 'en',
            target: 'gu',
            format: 'text'
        }, { 
            timeout: 3000,
            headers: { 'Content-Type': 'application/json' }
        });

        const translatedText = apiResponse.data?.translatedText;

        if (translatedText) {
            // 4. Update Cache & Return
            translationCache.set(cacheKey, translatedText);
            return translatedText;
        }

        return text; // Fallback to original if API response is invalid

    } catch (error) {
        // 5. Fail-Safe: Log error but NEVER block the main app loop
        console.warn(`[TRANSLATE SERVICE] API failed for: "${text.substring(0, 20)}...". Error: ${error.message}`);
        return text; 
    }
};

export default translateText;
