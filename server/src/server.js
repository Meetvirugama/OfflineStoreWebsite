import { fileURLToPath } from "url";
import "./config/env.js"; // 🔥 Load environment BEFORE anything else
import sequelize from "./config/db.js";
import app from "./app.js";
import { initCronJobs } from "./workers/cronJob.js";
import { syncMandiData } from "./services/mandiService.js";
import { MandiPrice } from "./models/index.js";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected");

    await sequelize.sync();
    console.log("✅ Tables synced");

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      
      // Arm the Scheduled Hub
      initCronJobs();

      // Initial Sync if empty (As proposed in MIS plan)
      (async () => {
          const count = await MandiPrice.count();
          if (count === 0 && process.env.DATA_GOV_API_KEY) {
              console.log("🌱 System detected empty Mandi Table. Triggering initial harvest...");
              await syncMandiData("Gujarat");
          }
      })();
    });

  } catch (error) {
    console.error("❌ Server failed:", error);
  }
};

startServer();