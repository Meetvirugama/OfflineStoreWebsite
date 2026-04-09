import app from "./app.js";
import sequelize from "./config/db.js";
import { ENV } from "./config/env.js";

// Import models to ensure associations are registered
import "./modules/index.js";

const startServer = async () => {
    const PORT = ENV.PORT || 5001;
    const HOST = '0.0.0.0';

    try {
        console.log("📡 [DEPL] Attempting to bind port...");
        const server = app.listen(PORT, HOST, () => {
            console.log(`🚀 [DEPL] Server listening on http://${HOST}:${PORT}`);
            console.log(`🌍 [DEPL] Environment: ${ENV.NODE_ENV}`);
        });

        console.log("📡 [DB] Connecting to Database...");
        console.log(`🔗 [DB] URL: ${ENV.DATABASE_URL ? ENV.DATABASE_URL.substring(0, 20) + "..." : "MISSING!"}`);
        
        await sequelize.authenticate();
        console.log("✅ [DB] Database Authenticated successfully.");

        console.log("🔄 [DB] Synchronizing models (Alter Mode)...");
        await sequelize.sync({ alter: true });
        console.log("✅ [DB] Database Synced successfully.");

        // --- SMTP VERIFICATION ---
        try {
            const { verifySMTP } = await import("./utils/email.js");
            await verifySMTP();
            console.log("✅ [EMAIL] SMTP Link established successfully.");
        } catch (err) {
            console.warn("⚠️  [EMAIL] SMTP Verification failed. Email features may not work.");
            console.warn("   Error:", err.message);
        }

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
