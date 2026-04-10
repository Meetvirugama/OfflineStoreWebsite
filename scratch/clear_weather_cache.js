import WeatherCache from "../server/backend/modules/weather/weather.model.js";

async function clearCache() {
    try {
        await WeatherCache.destroy({ where: {}, truncate: true });
        console.log("✅ Weather cache cleared successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error clearing cache:", err);
        process.exit(1);
    }
}

clearCache();
