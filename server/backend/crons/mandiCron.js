import cron from "node-cron";
import * as mandiService from "../modules/mandi/mandi.service.js";

/**
 * DAILY CRON JOB (00:00)
 * Refreshes Mandi Prices for popular states/districts to keep the PriceCache fresh.
 */
export const initMandiCron = () => {
    console.log("⏰ [CRON] Initializing Mandi Price Synchronization Job...");

    // Run every day at Midnight
    cron.schedule("0 0 * * *", async () => {
        console.log("📡 [CRON] Starting Daily Mandi Price Refresh...");
        try {
            // Refresh prices for common regions (e.g., Gujarat, Rajasthan)
            const regions = [
                { state: "Gujarat" },
                { state: "Rajasthan" },
                { state: "Maharashtra" }
            ];

            for (const region of regions) {
                console.log(`🔄 [CRON] Syncing prices for ${region.state}...`);
                await mandiService.getLiveMandiPrices(region);
            }

            console.log("✅ [CRON] Daily Mandi Price Refresh Complete.");
        } catch (err) {
            console.error("❌ [CRON] Mandi Price Refresh Failed:", err.message);
        }
    });
};
