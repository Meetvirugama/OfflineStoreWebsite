import { fileURLToPath } from "url";
import "./config/env.js"; // 🔥 Load environment BEFORE anything else
import sequelize from "./config/db.js";
import app from "./app.js";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected");

    await sequelize.sync();
    console.log("✅ Tables synced");

    app.listen(5001, () => {
      console.log("🚀 Server running on port 5001");
    });

  } catch (error) {
    console.error("❌ Server failed:", error);
  }
};

startServer();