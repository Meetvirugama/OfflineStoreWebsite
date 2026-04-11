import * as translationService from "./translation.service.js";

// @desc    Translate text payload
// @route   POST /api/translate
// @access  Public (Should ideally be rate-limited in production)
export const translate = async (req, res, next) => {
    try {
        const { text, targetLang, sourceLang, persistent = true } = req.body;
        
        if (!text || !targetLang) {
            return res.status(400).json({ success: false, message: "Missing required fields: text, targetLang" });
        }

        const translatedText = await translationService.translateText(text, targetLang, sourceLang, persistent);
        
        res.status(200).json({
            success: true,
            data: {
                original: text,
                translated: translatedText,
                targetLang
            }
        });
    } catch (error) {
        next(error);
    }
};
