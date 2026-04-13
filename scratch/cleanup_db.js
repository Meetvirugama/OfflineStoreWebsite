import User from "../server/backend/modules/user/user.model.js";
import VerificationReq from "../server/backend/modules/auth/verification.model.js";
import sequelize from "../server/backend/config/db.js";

async function cleanup() {
    try {
        console.log("🧼 [CLEANUP] Starting database cleanup...");
        
        // 1. Find all unverified users
        const unverifiedUsers = await User.findAll({ where: { is_verified: false } });
        console.log(`🔍 [CLEANUP] Found ${unverifiedUsers.length} unverified users in 'users' table.`);

        // 2. Safely remove them
        // In a real scenario, we might want to migrate them to VerificationReq, 
        // but the user specifically said "remove unverified user from database".
        if (unverifiedUsers.length > 0) {
            await User.destroy({ where: { is_verified: false } });
            console.log("✅ [CLEANUP] Unverified users removed from 'users' table.");
        }

        console.log("✨ [CLEANUP] Database is now clean.");
        process.exit(0);
    } catch (err) {
        console.error("❌ [CLEANUP] Error during cleanup:", err.message);
        process.exit(1);
    }
}

cleanup();
