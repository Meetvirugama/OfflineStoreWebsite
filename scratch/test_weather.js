
import sequelize from "../server/backend/config/db.js";
import * as weatherService from "../server/backend/modules/weather/weather.service.js";

async function testWeather() {
    try {
        const lat = 22.3039; // Rajkot
        const lon = 70.8022;

        console.log("Testing Current Weather...");
        const current = await weatherService.getCurrentWeather(lat, lon);
        console.log("Current Weather Response:", JSON.stringify(current, null, 2));

        console.log("\nTesting Weather Forecast...");
        const forecast = await weatherService.getForecastWeather(lat, lon);
        console.log("Forecast Data Points:", forecast.length);
        console.log("Sample Forecast Day:", JSON.stringify(forecast[0], null, 2));

        console.log("\nTesting Farming Insights...");
        const insights = weatherService.getFarmingInsights(current);
        console.log("Insights:", JSON.stringify(insights, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('API Error details:', error.response.data);
        }
    } finally {
        await sequelize.close();
    }
}

testWeather();
