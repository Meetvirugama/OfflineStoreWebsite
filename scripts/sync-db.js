import sequelize from "../server/src/config/db.js";

async function syncDb() {
  try {
    console.log("🌿 AgroMart | Deep Database Schema Sync Starting...");
    
    // 1. Check if 'customer' table exists and its columns
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'customer';
    `);
    
    const existingColumns = results.map(r => r.column_name);
    console.log("📊 Current 'customer' columns:", existingColumns);

    if (!existingColumns.includes('mobile')) {
      console.log("⚠️ 'mobile' column missing. Adding now...");
      await sequelize.query(`
        ALTER TABLE customer 
        ADD COLUMN mobile VARCHAR(255) UNIQUE;
      `);
      console.log("✅ Success! 'mobile' column added.");
    } else {
      console.log("✅ 'mobile' column already exists. No action needed.");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Deep Schema Sync Failed:", err.message);
    process.exit(1);
  }
}

syncDb();
