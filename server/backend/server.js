import app from "./app.js";
import sequelize from "./config/db.js";
import { ENV } from "./config/env.js";

// Import models to ensure associations are registered
import "./modules/index.js";

const startServer = async () => {
    const PORT = ENV.PORT || 5001;
    const HOST = '0.0.0.0';

    try {
        console.log("📡 [DB] Connecting to Database...");
        console.log(`🔗 [DB] URL: ${ENV.DATABASE_URL ? ENV.DATABASE_URL.substring(0, 20) + "..." : "MISSING!"}`);
        
        // --- 1. DB AUTHENTICATION (With Aggressive Manual Retries) ---
        let authenticated = false;
        let attempts = 0;
        const maxAttempts = 5;

        while (!authenticated && attempts < maxAttempts) {
            try {
                attempts++;
                await sequelize.authenticate();
                authenticated = true;
                console.log("✅ [DB] Database Authenticated successfully.");
            } catch (authErr) {
                console.error(`⚠️  [DB] Connection attempt ${attempts}/${maxAttempts} failed:`, authErr.message);
                if (attempts < maxAttempts) {
                    console.log("🔄 [DB] Retrying in 5 seconds...");
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } else {
                    throw authErr; // Re-throw after last attempt
                }
            }
        }

        // --- 2. DB SYNCHRONIZATION ---
        console.log("🔄 [DB] Synchronizing models (Alter Mode)...");
        await sequelize.sync({ alter: ENV.NODE_ENV !== "production" }); // Only alter in dev, safe in prod
        console.log("✅ [DB] Database Synced successfully.");

        // --- 3. SMTP VERIFICATION (Non-blocking) ---
        try {
            const { verifySMTP } = await import("./utils/email.js");
            await verifySMTP();
            console.log("✅ [EMAIL] SMTP Link established successfully.");
        } catch (err) {
            console.warn("⚠️  [EMAIL] SMTP Verification failed. Email features may not work.");
            console.warn("   Error:", err.message);
        }

        // --- 4. INITIALIZE CRON JOBS ---
        const { initMandiCron } = await import("./crons/mandiCron.js");
        initMandiCron();

        // --- 5. START LISTENING ---
        console.log("📡 [DEPL] Attempting to bind port...");
        app.listen(PORT, HOST, () => {
            console.log(`🚀 [DEPL] Server listening on http://${HOST}:${PORT}`);
            console.log(`🌍 [DEPL] Environment: ${ENV.NODE_ENV}`);
            console.log("✅ [READY] AgroMart ERP API is fully operational 🌾");
        });

    } catch (err) {
        console.error("❌ [CRIT] Failed to start server components:");
        console.error("Error Message:", err.message);
        if (err.name === 'SequelizeConnectionError') {
            console.error("👉 TIP: Check your DATABASE_URL and Render IP Allowlist.");
        }
        // We don't exit immediately so the process doesn't enter a crash-loop before Render can see the failure logs
        setTimeout(() => process.exit(1), 5000);
    }
};

startServer();
