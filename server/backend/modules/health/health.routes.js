import express from "express";
import sequelize from "../../config/db.js";
import { ENV } from "../../config/env.js";
import axios from "axios";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ success: true, message: "Health module is active" });
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

    // 4. Check Email Service (Brevo HTTP API)
    try {
        const { verifySMTP } = await import("../../utils/email.js");
        const smtpResult = await verifySMTP();
        if (smtpResult === true) {
            diagnostics.connectivity.smtp = "CONNECTED ✅";
        } else {
            // verifySMTP returns false if it fails, let's get the error from the function if possible
            // Re-run it here to capture the error in this context
            const { getTransporter } = await import("../../utils/email.js");
            const transport = await getTransporter();
            if (!transport) {
                diagnostics.connectivity.smtp = "CONFIG MISSING ❌ (Check BREVO_API_KEY)";
            } else {
                try {
                    await transport.verify();
                    diagnostics.connectivity.smtp = "CONNECTED ✅";
                } catch (vErr) {
                    diagnostics.connectivity.smtp = `FAILED ❌ (${vErr.message})`;
                }
            }
        }
    } catch (err) {
        diagnostics.connectivity.smtp = `ERROR ❌ (${err.message})`;
    }

    res.json({
        success: true,
        message: "AgroMart Backend Diagnostics",
        diagnostics
    });
});

export default router;
