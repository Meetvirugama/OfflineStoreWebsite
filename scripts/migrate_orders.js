import sequelize from "../server/src/config/db.js";

async function migrate() {
  try {
    console.log("🚀 Starting database migration for Orders timestamps...");
    
    // Add createdAt if not exists
    await sequelize.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `);

    // Add updatedAt if not exists
    await sequelize.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `);

    console.log("✅ Database migration successful! Timestamps are now tracked.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
}

migrate();
