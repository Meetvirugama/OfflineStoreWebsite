import cron from "node-cron";
import { syncMandiData } from "../services/mandiService.js";

/**
 * MANDI DATA DAILY SYNC JOB
 * Schedule: 11:00 PM (23:00) every day
 */
export const initCronJobs = () => {
    console.log("⏰ Initializing Scheduled Jobs Hub...");

    // Daily Mandi Sync (Gujarat)
    cron.schedule("0 23 * * *", async () => {
        try {
            console.log("🌙 Nightly Trigger: Mandi Price Sync Starting...");
            await syncMandiData("Gujarat");
            console.log("🌙 Nightly Trigger: Mandi Price Sync Finished.");
        } catch (err) {
            console.error("🌙 Nightly Trigger: Mandi Sync ERROR:", err.message);
        }
    });

    console.log("✅ Cron Job for 11 PM Mandi Sync is ARMED.");
};

export default initCronJobs;
