import cron from "node-cron";
import { runEngine, runAI } from "../services/notificationService.js";
import { Op } from "sequelize";
import User from "../models/User.js";
import Customer from "../models/Customer.js";

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
   🧹 2. OTP CLEANUP SYSTEM
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
   ☕ 3. KEEP-ALIVE SYSTEM (Prevent Sleep)
   Runs every 5 minutes to keep Render Free Tier awake
========================= */
import axios from "axios";
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