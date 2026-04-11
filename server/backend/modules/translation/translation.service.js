import axios from "axios";
import { ENV } from "../../config/env.js";
import Translation from "./translation.model.js";

// You can override this via ENV if you self-host LibreTranslate
// e.g., export LIBRETRANSLATE_URL=http://localhost:5000/translate
const LIBRETRANSLATE_URL = ENV.LIBRETRANSLATE_URL || "https://libretranslate.de/translate";

// Ephemeral in-memory cache for volatile data (like daily news) to avoid DB bloat
const ephemeralCache = new Map();

export const translateText = async (text, targetLang, sourceLang = "en", persistent = true) => {
    if (!text) return "";
    
    // Quick escape for same-language requests
    if (sourceLang === targetLang) return text;
    
    // Clean strings (trim leading/trailing spaces but maintain original length for return)
    const originalText = text.toString().trim();
    if (!originalText) return text;

    const cacheKey = `${originalText}_${targetLang}`;

    try {
        // 1. Check ephemeral in-memory cache first (super fast)
        if (ephemeralCache.has(cacheKey)) {
            return ephemeralCache.get(cacheKey);
        }

        // 2. Check local database cache (Case-Insensitive for maximum dictionary reliability)
        const { Op } = await import("sequelize");
        const cached = await Translation.findOne({
            where: { 
                original_text: { [Op.iLike]: originalText },
                target_lang: targetLang 
            }
        });
        
        if (cached) {
            return cached.translated_text;
        }

        // 2. Fallback to API if not cached
        console.log(`🌍 Translating via API (${sourceLang} -> ${targetLang}): "${originalText.substring(0, 30)}..."`);
        
        const response = await axios.post(LIBRETRANSLATE_URL, {
            q: originalText,
            source: sourceLang,
            target: targetLang,
            format: "text"
        }, {
            headers: { "Content-Type": "application/json" }
        });

        const translatedText = response.data.translatedText;

        if (translatedText) {
            // Always save to ephemeral cache to avoid duplicate API calls during session
            ephemeralCache.set(cacheKey, translatedText);
            
            // Limit memory cache size to prevent memory leaks (max 10,000 items)
            if (ephemeralCache.size > 10000) {
                const firstKey = ephemeralCache.keys().next().value;
                ephemeralCache.delete(firstKey);
            }

            // 4. Save to database cache asynchronously ONLY if persistent is true
            if (persistent) {
                try {
                    await Translation.create({
                        original_text: originalText,
                        target_lang: targetLang,
                        translated_text: translatedText
                    });
                } catch (dbErr) {
                    // Ignore unique constraint errors arising from race conditions
                    if (dbErr.name !== 'SequelizeUniqueConstraintError') {
                        console.error("Failed to cache translation:", dbErr.message);
                    }
                }
            }
            return translatedText;
        }

        return text; // Return original if API fails quietly

    } catch (error) {
        console.warn(`Translation API Error: ${error.message}. Yielding original text.`);
        // Graceful degradation: If API is down or rate-limited, return English text so app doesn't crash
        return text;
    }
};

// Exported utility to clear the in-memory cache when Admin edits a string manually
export const clearCacheKeys = (originalText) => {
    if (!originalText) return;
    const guCacheKey = `${originalText}_gu`;
    if (ephemeralCache.has(guCacheKey)) {
        ephemeralCache.delete(guCacheKey);
    }
};
