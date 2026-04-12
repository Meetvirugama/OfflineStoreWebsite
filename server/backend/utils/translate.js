import axios from 'axios';
import Groq from 'groq-sdk';
import { ENV } from '../config/env.js';

// In-memory cache to minimize API overhead
const translationCache = new Map();

// Initialize Groq for high-accuracy translation
let groqClient = null;
const getGroq = () => {
    if (groqClient) return groqClient;
    if (!ENV.GROQ_KEY) return null;
    groqClient = new Groq({ apiKey: ENV.GROQ_KEY });
    return groqClient;
};

/**
 * PRODUCTION-GRADE HYBRID AI TRANSLATION
 * Accuracy Tier 1: Groq (Llama-3) - Context-aware & Agricultural focused
 * Accuracy Tier 2: LibreTranslate - Machine Translation fallback
 * Accuracy Tier 3: Original Text - Stability fallback
 */
export const translateText = async (text, targetLang = 'en') => {
    // 1. Basic validation & optimization
    if (!text || typeof text !== 'string' || text.trim() === '') return text;
    if (targetLang === 'en') return text;
    if (targetLang !== 'gu') return text;

    const cacheKey = `${text}_${targetLang}`;

    // 2. Check Hit in Cache
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }

    // 3. ATTEMPT AI TRANSLATION (Best Accuracy)
    const groq = getGroq();
    if (groq && text.length < 3000) { // Safety: Skip AI for extremely massive blocks
        try {
            const prompt = `
                Translate the following English agricultural/ERP text into localized Gujarati for a farmer.
                TEXT: "${text}"
                
                STRICT RULES:
                1. Return ONLY the translated Gujarati text.
                2. Preserve any numbers, punctuation, or technical codes (id:101, [NEW]).
                3. Use common farming terminology used in Gujarat.
                4. Do NOT explain the translation.
            `;

            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile",
                temperature: 0,
                max_tokens: 1000
            });

            const rawResponse = completion.choices[0]?.message?.content || '';
            let translatedText = rawResponse.trim().replace(/^"(.*)"$/, '$1');

            // 🚀 SMART CLEANUP: If the response contains English preamble, extract only Gujarati characters
            // Gujarati Unicode Range: \u0A80-\u0AFF
            const gujaratiMatch = translatedText.match(/[\u0A80-\u0AFF][\s\S]*[\u0A80-\u0AFF]/);
            if (gujaratiMatch && translatedText.length > rawResponse.length / 2) {
                translatedText = gujaratiMatch[0];
            }

            if (translatedText && translatedText !== text) {
                translationCache.set(cacheKey, translatedText);
                return translatedText;
            }
        } catch (error) {
            console.warn(`[AI TRANSLATE] Error: ${error.message}`);
        }
    }

    // 4. ATTEMPT MACHINE TRANSLATION (LibreTranslate - Fallback)
    try {
        const apiResponse = await axios.post(ENV.TRANSLATE_API_URL, {
            q: text,
            source: 'en',
            target: 'gu'
        }, { 
            timeout: 5000, // Maximum resilience for news feed
            headers: { 'Content-Type': 'application/json' }
        });

        const mlTranslated = apiResponse.data?.translatedText;
        if (mlTranslated) {
            translationCache.set(cacheKey, mlTranslated);
            return mlTranslated;
        }
    } catch (error) {
        if (text.length > 5) {
            console.warn(`[ML FALLBACK] Busy for: "${text.substring(0, 15)}..."`);
        }
    }

    // 5. Final Fail-Safe: Return original English
    // We log once to track if systems are completely down
    if (text.length > 5) {
        console.warn(`[TRANSLATE SYSTEM] Total failure for: "${text.substring(0, 20)}...". Returning original.`);
    }
    return text;
};

export default translateText;
