import app from "./app.js";
import sequelize from "./config/db.js";
import { ENV } from "./config/env.js";

// Import models to ensure associations are registered
import "./modules/index.js";

const startServer = async () => {
    try {
        console.log("📡 Connecting to Database...");
        console.log(`🔗 URL: ${ENV.DATABASE_URL ? ENV.DATABASE_URL.substring(0, 15) + "..." : "MISSING"}`);
        await sequelize.authenticate();
        console.log("✅ Database Authenticated successfully.");

        // Synchronize models with the database
        // In this modular migration, we need to ensure table names match our new models (singular vs plural)
        console.log("🔄 Synchronizing models...");
        await sequelize.sync({ alter: true });
        console.log("✅ Database Synced successfully (Alter Mode).");

        const PORT = ENV.PORT || 5001;
        const HOST = '0.0.0.0'; // Explicitly bind for Render/Cloud compatibility

        app.listen(PORT, HOST, () => {
            console.log(`🚀 Modular Server running in ${ENV.NODE_ENV} mode`);
            console.log(`📡 URL: http://${HOST}:${PORT}`);
        });

    } catch (err) {
        console.error("❌ Failed to start server:", err.message);
        process.exit(1);
    }
};

startServer();
