import { useState, useEffect, useRef } from "react";
import useTranslation from "./useTranslation";
import apiClient from "@core/api/client";

// Global in-memory cache to prevent redundant API calls across component unmounts within the same session
const translationCache = new Map();

/**
 * A hook for translating dynamic strings (like from a database or external API)
 * It returns the original English text immediately if language is English,
 * and fetches the Gujarati translation from the backend if language is Gujarati.
 * 
 * @param {string} text - The original English text to translate
 * @param {boolean} persistent - Whether to save this translation permanently in the DB (default true)
 * @returns {string} The translated text, or original text while loading / if API fails
 */
export const useDynamicTranslation = (text, persistent = true) => {
    const { lang } = useTranslation();
    const [translatedText, setTranslatedText] = useState(text);
    const textRef = useRef(text);
    const langRef = useRef(lang);

    useEffect(() => {
        // ... (unchanged previous logic handled by refs below)
        textRef.current = text;
        langRef.current = lang;

        if (text === null || text === undefined || text === "") {
            setTranslatedText("");
            return;
        }

        // 1. If language is English, just return English text immediately
        if (lang === "en") {
            setTranslatedText(text);
            return;
        }

        // 2. We are in Gujarati mode. Check in-memory cache first
        const cacheKey = `${text}_${lang}`;
        if (translationCache.has(cacheKey)) {
            setTranslatedText(translationCache.get(cacheKey));
            return;
        }

        // Since it's not cached, default to original text while fetching
        setTranslatedText(text);

        let isMounted = true;

        // 3. Fetch from our backend proxy which handles LibreTranslate caching
        const fetchTranslation = async () => {
            try {
                const textStr = String(text || "");
                // Ignore empty spaces
                if (!textStr.trim()) return;

                const res = await apiClient.post("/translate", { 
                    text: textStr, 
                    targetLang: lang,
                    sourceLang: "en",
                    persistent: persistent
                });
                
                if (isMounted && res && res.data && res.data.translated) {
                    const resultText = res.data.translated;
                    translationCache.set(cacheKey, resultText);
                    setTranslatedText(resultText);
                }
            } catch (err) {
                // Silently fallback to English if the translation API fails
                console.warn("Dynamic translation failed, falling back to original text.");
            }
        };

        fetchTranslation();

        return () => {
            isMounted = false;
        };
    }, [text, lang]);

    // Return the state. It will be the original English string initially, 
    // and seamlessly update to Gujarati once fetched.
    return translatedText;
};

export default useDynamicTranslation;
