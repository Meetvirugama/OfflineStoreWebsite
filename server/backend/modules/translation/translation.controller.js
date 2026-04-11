import * as translationService from "./translation.service.js";
import Translation from "./translation.model.js";

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

// @desc    Get all translations (Glossary)
// @route   GET /api/translations
// @access  Private/Admin
export const getTranslations = async (req, res, next) => {
    try {
        const translations = await Translation.findAll({
            order: [['updatedAt', 'DESC']]
        });
        res.status(200).json({ success: true, count: translations.length, data: translations });
    } catch (error) {
        next(error);
    }
};

// @desc    Add a manual translation override
// @route   POST /api/translations
// @access  Private/Admin
export const addTranslation = async (req, res, next) => {
    try {
        const { original_text, target_lang, translated_text } = req.body;
        const translation = await Translation.create({
            original_text,
            target_lang: target_lang || 'gu',
            translated_text
        });
        // Clear memory cache so the next call hits the DB
        translationService.clearCacheKeys(original_text);
        res.status(201).json({ success: true, data: translation });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, message: "Translation already exists for this term." });
        }
        next(error);
    }
};

// @desc    Update a translation override
// @route   PUT /api/translations/:id
// @access  Private/Admin
export const updateTranslation = async (req, res, next) => {
    try {
        const { translated_text } = req.body;
        const translation = await Translation.findByPk(req.params.id);
        if (!translation) return res.status(404).json({ success: false, message: "Not found" });
        
        translation.translated_text = translated_text;
        await translation.save();
        
        // Clear memory cache
        translationService.clearCacheKeys(translation.original_text);
        
        res.status(200).json({ success: true, data: translation });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a translation
// @route   DELETE /api/translations/:id
// @access  Private/Admin
export const deleteTranslation = async (req, res, next) => {
    try {
        const translation = await Translation.findByPk(req.params.id);
        if (!translation) return res.status(404).json({ success: false, message: "Not found" });
        
        const original = translation.original_text;
        await translation.destroy();
        
        translationService.clearCacheKeys(original);
        res.status(200).json({ success: true, message: "Translation removed" });
    } catch (error) {
        next(error);
    }
};
