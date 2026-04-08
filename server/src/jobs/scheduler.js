import cron from "node-cron";
import axios from "axios";
import { runEngine, runAI } from "../services/notificationService.js";
import { syncFarmingNews } from "../services/newsService.js";
import { syncMandiData } from "../services/mandiService.js";
import { Op } from "sequelize";
import { User, Customer, CropAdvisory, Notification } from "../models/index.js";





/* =========================
   🔔 1. DAILY NOTIFICATION SYSTEM
   Runs every day at 9 AM
========================= */
cron.schedule("0 9 * * *", async () => {
    try {
        await runEngine();
        await runAI();
    } catch (err) {
        console.error("❌ Notification cron error:", err.message);
    }
});

/* =========================
   📰 2. FARMING NEWS SYNC
   Runs every 6 hours
========================= */
cron.schedule("0 */6 * * *", async () => {
    try {
        console.log("📰 Scheduled Trigger: Syncing Farming News...");
        await syncFarmingNews();
    } catch (err) {
        console.error("❌ News sync error:", err.message);
    }
});

/* =========================
   🌱 3. DAILY CROP ADVISORY
   Runs every day at 7 AM
========================= */
cron.schedule("0 7 * * *", async () => {
    try {
        console.log("🌱 Scheduled Trigger: Generating Morning Crop Advisories...");
        
        // Find users who have generated an advisory in the last 30 days
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 30);

        const activeFarmers = await CropAdvisory.findAll({
            attributes: ['user_id', 'crop', 'location'],
            where: {
                created_at: { [Op.gte]: targetDate },
                user_id: { [Op.not]: null }
            },
            group: ['user_id', 'crop', 'location']
        });

        for (const farm of activeFarmers) {
            await Notification.create({
                user_id: farm.user_id,
                type: "CROP_ADVISORY",
                message: `🌿 Your morning advisory for ${farm.crop} in ${farm.location} is ready.`,
            });
        }
        
        console.log(`✅ Morning advisories generated for ${activeFarmers.length} farmers.`);
    } catch (err) {
        console.error("❌ Advisory cron error:", err.message);
    }
});


/* =========================
   📉 3. MANDI PRICE SYNC
   Runs every day at 11 PM
========================= */
cron.schedule("0 23 * * *", async () => {
    try {
        console.log("📉 Scheduled Trigger: Nightly Mandi Sync Starting...");
        await syncMandiData("Gujarat");
        console.log("✅ Nightly Mandi Sync Finished.");
    } catch (err) {
        console.error("❌ Mandi sync error:", err.message);
    }
});


/* =========================
   🧹 3. OTP CLEANUP SYSTEM
   Runs every 5 minutes
========================= */
cron.schedule("*/5 * * * *", async () => {
    try {
        const expiredUsers = await User.findAll({
            where: {
                is_verified: false,
                otp_expiry: {
                    [Op.lt]: new Date()
                }
            }
        });

        for (const user of expiredUsers) {
            await Customer.destroy({
                where: { user_id: user.id }
            });

            await user.destroy();
        }

    } catch (err) {
        console.error("❌ OTP cleanup error:", err.message);
    }
});

/* =========================
   ☕ 4. KEEP-ALIVE SYSTEM (Prevent Sleep)
   Runs every 5 minutes to keep Render Free Tier awake
========================= */
cron.schedule("*/5 * * * *", async () => {

    try {
        const url = process.env.BACKEND_URL || "https://offlinestorewebsite.onrender.com";
        await axios.get(`${url}/api/products`); // Simple lightweight hit
        console.log("☕ Keep-alive ping sent to:", url);
    } catch (err) {
        console.error("❌ Keep-alive error:", err.message);
    }
});


console.log("🚀 Cron jobs initialized");