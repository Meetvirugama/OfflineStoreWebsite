import app from "./app.js";
import sequelize from "./config/db.js";
import { ENV } from "./config/env.js";

// Import models to ensure associations are registered
import "./modules/index.js";

const startServer = async () => {
    try {
        console.log("📡 Connecting to Database...");
        await sequelize.authenticate();
        console.log("✅ Database Connected.");

        // In production, you might not want to sync automatically.
        // But for this migration, it ensures the tables match the models.
        if (process.env.NODE_ENV === "development") {
            await sequelize.sync({ alter: true });
            console.log("🔄 Database Synced (Alter Mode).");
        }

        const PORT = ENV.PORT || 5001;
        app.listen(PORT, () => {
            console.log(`🚀 Modular Server running in ${ENV.NODE_ENV} mode on port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ Failed to start server:", err.message);
        process.exit(1);
    }
};

startServer();
