import sequelize from "../server/src/config/db.js";

async function manualMigration() {
  try {
    console.log("⏳ Starting manual database migration...");
    await sequelize.authenticate();
    console.log("✅ Authenticated to Postgres");

    // 1. Add auth_provider
    await sequelize.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "auth_provider" VARCHAR(20) DEFAULT 'LOCAL';
    `);
    console.log("✔️  Column 'auth_provider' added/verified.");

    // 2. Add is_verified
    await sequelize.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "is_verified" BOOLEAN DEFAULT false;
    `);
    console.log("✔️  Column 'is_verified' added/verified.");

    // 3. Add otp
    await sequelize.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "otp" VARCHAR(10);
    `);
    console.log("✔️  Column 'otp' added/verified.");

    // 4. Add otp_expiry
    await sequelize.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "otp_expiry" TIMESTAMP WITH TIME ZONE;
    `);
    console.log("✔️  Column 'otp_expiry' added/verified.");

    console.log("🚀 Manual migration finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

manualMigration();
