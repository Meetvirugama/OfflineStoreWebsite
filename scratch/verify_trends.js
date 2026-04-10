
import sequelize from "../server/backend/config/db.js";
import * as mandiService from "../server/backend/modules/mandi/mandi.service.js";

async function verifyTrends() {
    try {
        const crop = "Cotton";
        const district = "Rajkot";
        const days = 15;
        const state = "Gujarat";

        console.log(`Fetching trends for ${crop} in ${district}...`);
        const trends = await mandiService.getMultiCropComparison([crop], days, district, state);
        
        console.log("Trend Data Points:", trends.length);
        if (trends.length > 0) {
            console.log("Dates returned:", trends.map(t => t.date));
            console.log("Sample point:", trends[0]);
        } else {
            console.log("No trend data found in DB!");
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

verifyTrends();
