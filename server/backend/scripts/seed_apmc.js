import axios from "axios";
import Apmc from "../modules/mandi/apmc.model.js";
import sequelize from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * PRODUCTION-GRADE OFFICIAL APMC SEEDER (GOOGLE POWERED)
 * 
 * Strategy:
 * 1. Fetch ALL official market names from data.gov.in (Gujarat).
 * 2. Geocode each official name using Google Geocoding API for 100% accuracy.
 * 3. Seed the production 'apmc' table.
 */

const DATA_GOV_KEY = process.env.DATA_GOV_API_KEY || "579b464db66ec23bdd000001451a9d7829b546876f16c0ac968d9b54";
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const GOOGLE_KEY = process.env.GOOGLE_GEOCODING_API_KEY;

const BLACKLIST = /mandir|temple|ashram|school|college|hospital/i;

async function seedOfficialApmcs() {
    console.log("🚀 Initializing Production APMC Migration (Google Engine)...");

    if (!GOOGLE_KEY) {
        console.error("❌ Google Geocoding API Key missing in .env");
        process.exit(1);
    }

    try {
        await sequelize.authenticate();

        // 1. Fetch Official Names
        console.log("📡 Fetching Official Names from Agmarknet...");
        const rosterRes = await axios.get(`https://api.data.gov.in/resource/${RESOURCE_ID}`, {
            params: { "api-key": DATA_GOV_KEY, format: "json", limit: 1500, "filters[state]": "Gujarat" }
        });

        const officialMarkets = Array.from(new Map(rosterRes.data.records.map(r => [
            r.market.toLowerCase().trim(), 
            { name: r.market, district: r.district }
        ])).values());
        
        console.log(`✅ Identified ${officialMarkets.length} Official Markets in Gujarat.`);

        // 2. Clear Production Table
        console.log("🧹 Purging existing APMC data...");
        await Apmc.destroy({ where: {}, truncate: true });

        // 3. Geocoding Loop
        const total = officialMarkets.length;
        let success = 0;

        console.log("📍 Mapping coordinates via Google Geocoding...");

        for (let i = 0; i < total; i++) {
            const m = officialMarkets[i];
            if (BLACKLIST.test(m.name)) continue;

            try {
                // HIGH-PRECISION QUERY: Township First. 
                // We remove District from primary query to prevent 'District Stacking'
                const address = `${m.name}, Gujarat, India`;
                const gRes = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
                    params: { address, key: GOOGLE_KEY }
                });

                let result = gRes.data?.results?.[0];

                // Fallback: slightly broader search
                if (!result) {
                    const fallback = `${m.name} Mandi, ${m.district}, Gujarat`;
                    const gResFb = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
                        params: { address: fallback, key: GOOGLE_KEY }
                    });
                    result = gResFb.data?.results?.[0];
                }

                if (result) {
                    const { lat, lng } = result.geometry.location;
                    await Apmc.create({
                        name: m.name,
                        district: m.district,
                        state: "Gujarat",
                        lat,
                        lng
                    });
                    success++;
                    console.log(`✅ [${i+1}/${total}] Mapped: ${m.name} -> (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
                } else {
                    console.warn(`❓ [${i+1}/${total}] Failed: ${m.name}`);
                }
            } catch (err) {
                console.error(`❌ Error geocoding ${m.name}:`, err.message);
            }

            // Google Cloud doesn't have the 1req/sec limit like Nominatim, but let's be polite
            await new Promise(res => setTimeout(res, 50)); 
        }

        console.log(`🎉 Production Migration Complete! ${success}/${total} Markets seeded.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Fatal Error:", err.message);
        process.exit(1);
    }
}

seedOfficialApmcs();
