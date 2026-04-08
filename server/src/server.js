import { fileURLToPath } from "url";
import "./config/env.js"; // 🔥 Load environment BEFORE anything else
import sequelize from "./config/db.js";
import app from "./app.js";
import { syncFarmingNews } from "./services/newsService.js";
import { MandiPrice, FarmingNews } from "./models/index.js";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected");

    await sequelize.sync();
    console.log("✅ Tables synced");



    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      
      // Initial Sync if empty
      (async () => {
          // 1. Mandi Data
          const mandiCount = await MandiPrice.count();
          if (mandiCount === 0 && process.env.DATA_GOV_API_KEY) {
              console.log("🌱 System detected empty Mandi Table. Triggering initial harvest...");
              await syncMandiData("Gujarat");
          }

          // 2. Farming News
          const newsCount = await FarmingNews.count();
          if (newsCount === 0) {
              console.log("📰 System detected empty News Table. Triggering initial fetch...");
              await syncFarmingNews();
          }
      })();
    });


  } catch (error) {
    console.error("❌ Server failed:", error);
  }
};

startServer();