import axios from "axios";
import Apmc from "../modules/mandi/apmc.model.js";
import sequelize from "../config/db.js";
import { ENV } from "../config/env.js";

/**
 * ONE-TIME SEEDING SCRIPT
 * Extracts all Gujarat APMC locations from Overpass API
 * and populates the production APMC table.
 */
async function seedGujaratApmcs() {
    console.log("🚀 Initializing Gujarat APMC Seed Process...");
    
    try {
        await sequelize.authenticate();
        console.log("✅ Database Connected.");

        // Synchronize the Apmc model (ensures table and index exist)
        await Apmc.sync({ alter: true });
        console.log("✅ APMC Table Synchronized.");

        // Clear existing data (optional, but good for a fresh seed)
        // await Apmc.destroy({ where: {}, truncate: true });

        // Mirror Redundancy for Overpass API
        const mirrors = [
            "https://overpass-api.de/api/interpreter",
            "https://overpass.osm.ch/api/interpreter",
            "https://overpass.kumi.systems/api/interpreter",
            "https://z.overpass-api.de/api/interpreter"
        ];

        const query = `[out:json][timeout:60];
            (
              node["amenity"="marketplace"](20.1,68.1,24.7,74.5);
              way["amenity"="marketplace"](20.1,68.1,24.7,74.5);
              node["name"~"mandi|apmc",i](20.1,68.1,24.7,74.5);
              way["name"~"mandi|apmc",i](20.1,68.1,24.7,74.5);
            );
            out center;`;

        let elements = [];
        let success = false;

        for (const mirror of mirrors) {
            try {
                console.log(`📡 Fetching data from: ${mirror}...`);
                const response = await axios.post(mirror, query, {
                    headers: { 'Content-Type': 'text/plain' },
                    timeout: 80000
                });
                
                if (response.data?.elements) {
                    elements = response.data.elements;
                    success = true;
                    break;
                }
            } catch (err) {
                console.warn(`⚠️ Mirror ${mirror} failed: ${err.message}`);
            }
        }

        if (!success) {
            throw new Error("All Overpass mirrors failed or timed out.");
        }
        console.log(`📦 Found ${elements.length} primary market elements.`);

        const seedBatches = [];
        const processedNames = new Set();

        for (const el of elements) {
            const name = el.tags?.name;
            if (!name) continue;

            const lat = el.lat || el.center?.lat;
            const lng = el.lon || el.center?.lng || el.center?.lon;

            if (!lat || !lng) continue;

            // Simple deduplication based on name and proximity
            const nameLower = name.toLowerCase();
            if (processedNames.has(nameLower)) continue;
            processedNames.add(nameLower);

            seedBatches.push({
                name,
                district: el.tags["addr:district"] || el.tags["is_in:district"] || "Unknown",
                state: "Gujarat",
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            });
        }

        console.log(`✨ Filtering complete. Preparing to insert ${seedBatches.length} verified markets.`);

        if (seedBatches.length > 0) {
            await Apmc.bulkCreate(seedBatches, { ignoreDuplicates: true });
            console.log("✅ Bulk Insertion Successful.");
        }

        console.log("🎉 Seed Process Completed Successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed Process Failed:", err.message);
        process.exit(1);
    }
}

seedGujaratApmcs();
