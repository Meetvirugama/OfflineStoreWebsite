import express from "express";
import sequelize from "../../config/db.js";
import { ENV } from "../../config/env.js";
import axios from "axios";
import { translateText } from "../../utils/translate.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ success: true, message: "Health module is active" });
});

/**
 * PATH: GET /api/health/translate-test
 * Purpose: Deep Diagnostic for Hybrid AI Translation (Groq + ML)
 */
router.get("/translate-test", async (req, res) => {
    const testString = "Fresh cotton crop ready for market in Gujarat.";
    try {
        const startTime = Date.now();
        const translated = await translateText(testString, 'gu');
        const duration = Date.now() - startTime;

        const isAI = translated.includes('કપાસ') || translated.includes('ગુજરાત');
        const isFallback = (translated === testString);

        res.json({
            success: true,
            status: isFallback ? "FALLBACK_ACTIVE ⚠️" : "OPERATIONAL ✅",
            engine: isAI ? "Groq (AI-Tier)" : "LibreTranslate (ML-Tier)",
            performance: `${duration}ms`,
            localization: {
                target: "Gujarati",
                input: testString,
                output: translated
            },
            config: {
                has_groq_key: !!ENV.GROQ_KEY,
                target_url: ENV.TRANSLATE_API_URL
            }
        });
    } catch (err) {
        res.json({
            success: false,
            error: err.message,
            message: "Translation infrastructure completely unreachable"
        });
    }
});

router.get("/diagnostics", async (req, res) => {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: ENV.NODE_ENV,
        connectivity: {
            database: "UNKNOWN",
            external_apis: {
                weather: "UNKNOWN",
                mandi: "UNKNOWN",
                news: "UNKNOWN"
            }
        },
        request_context: {
            origin: req.headers.origin || "N/A",
            host: req.headers.host || "N/A",
            user_agent: req.headers["user-agent"]
        }
    };

    // 1. Check Database
    try {
        await sequelize.authenticate();
        diagnostics.connectivity.database = "CONNECTED ✅";
    } catch (err) {
        diagnostics.connectivity.database = `FAILED ❌ (${err.message})`;
    }

    // 2. Check Weather API (Tomorrow.io)
    try {
        if (ENV.TOMORROW_KEY) {
            await axios.get(`https://api.tomorrow.io/v4/weather/realtime?location=delhi&apikey=${ENV.TOMORROW_KEY}`, { timeout: 3000 });
            diagnostics.connectivity.external_apis.weather = "REACHABLE ✅";
        } else {
            diagnostics.connectivity.external_apis.weather = "CONFIG MISSING ⚠️";
        }
    } catch {
        diagnostics.connectivity.external_apis.weather = "UNREACHABLE ❌";
    }

    // 3. Check Mandi API (Data.gov.in)
    try {
        if (ENV.DATA_GOV_KEY) {
            await axios.get(`https://api.data.gov.in/resource/9ef2731d-bf40-4176-8f64-d50d7d3d8102?api-key=${ENV.DATA_GOV_KEY}&format=json&limit=1`, { timeout: 3000 });
            diagnostics.connectivity.external_apis.mandi = "REACHABLE ✅";
        } else {
            diagnostics.connectivity.external_apis.mandi = "CONFIG MISSING ⚠️";
        }
    } catch {
        diagnostics.connectivity.external_apis.mandi = "UNREACHABLE ❌";
    }

    res.json({
        success: true,
        message: "AgroMart Backend Diagnostics",
        diagnostics
    });
});

export default router;
