import sequelize from "./config/db.js";
import { ENV } from "./config/env.js";

async function runCheck() {
    console.log("🔍 AGROMART SYSTEM HEALTH CHECK");
    console.log("===============================");
    
    console.log(`📡 Checking Environment Variables...`);
    if (ENV.DATABASE_URL) {
        console.log("✅ DATABASE_URL: Detected");
    } else {
        console.error("❌ DATABASE_URL: MISSING");
    }

    if (ENV.JWT_SECRET) {
        console.log("✅ JWT_SECRET: Detected");
    } else {
        console.warn("⚠️ JWT_SECRET: Defaulting to insecure fallback");
    }

    console.log(`\n⏳ Validating Database Connection...`);
    try {
        await sequelize.authenticate();
        console.log("✅ Database Authenticated successfully.");
        
        const [result] = await sequelize.query("SELECT current_database(), current_user;");
        console.log("📊 Connection Details:", result[0]);
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Database connection failed:");
        console.error(error.message);
        process.exit(1);
    }
}

runCheck();
