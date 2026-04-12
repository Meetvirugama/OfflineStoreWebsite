
import { getNearbyMandis, searchMandis } from "../modules/mandi/mandi.service.js";
import sequelize from "../config/db.js";

async function runDebug() {
    console.log("🚀 Starting Mandi Debug...");
    
    try {
        // Test 1: Search (Nominatim)
        console.log("\n--- Testing Mandi Search (Nominatim) ---");
        const searchResults = await searchMandis("Rajkot");
        console.log("Search Results for 'Rajkot':", JSON.stringify(searchResults, null, 2));

        if (searchResults.length > 0) {
            const { lat, lng } = searchResults[0];
            
            // Test 2: Nearby Discovery (Overpass)
            console.log(`\n--- Testing Nearby Discovery (Overpass) at ${lat}, ${lng} ---`);
            const nearbyMandis = await getNearbyMandis(lat, lng);
            console.log(`Found ${nearbyMandis.length} mandis nearby.`);
            
            if (nearbyMandis.length > 0) {
                console.log("First Mandi Detail:", JSON.stringify(nearbyMandis[0], null, 2));
            } else {
                console.log("⚠️ No mandis found in 50km radius.");
            }
        }

    } catch (err) {
        console.error("❌ Debug Error:", err);
    } finally {
        await sequelize.close();
        console.log("\n🏁 Debug Finished.");
    }
}

runDebug();
