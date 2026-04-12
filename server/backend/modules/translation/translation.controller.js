import { translateText } from '../../utils/translate.js';

/**
 * PRODUCTION-GRADE TRANSLATION CONTROLLER
 * Logic: Handle manual translation requests for UI (tooltips, dynamic text)
 */
export const translate = async (req, res) => {
    try {
        const { q, lang } = req.body;

        if (!q) {
            return res.status(400).json({ success: false, error: "Text 'q' is required" });
        }

        const targetLang = lang === 'gu' ? 'gu' : 'en';

        // Utilize the high-performance utility (which already handles caching)
        const translated = await translateText(q, targetLang);

        res.json({
            success: true,
            q,
            translated,
            lang: targetLang
        });
    } catch (err) {
        console.error("[TRANSLATION CONTROLLER ERROR]", err);
        res.status(500).json({ success: false, error: "Dynamic translation failed" });
    }
};
