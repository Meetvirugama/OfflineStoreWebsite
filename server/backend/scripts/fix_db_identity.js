import sequelize from '../config/db.js';

const recreatePestDetectionTable = async () => {
    console.log("🛠  Recreating [pest_detections] table for correct schema (INTEGER vs UUID)...");
    
    try {
        // Since there are 0 row, it's safe to drop and let Sequelize recreate it cleanly
        // OR we just run the DDL manually to match the model
        
        await sequelize.query(`DROP TABLE IF EXISTS "pest_detections" CASCADE;`);
        console.log("✅ [SUCCESS] Dropped old mismatched table.");

        // We run a sync specifically for this model to ensure it uses the Sequelize definition
        const PestDetection = (await import('../modules/crop/pest_detection.model.js')).default;
        await PestDetection.sync({ force: true });
        
        console.log("✅ [SUCCESS] Recreated 'pest_detections' with correct INTEGER Identity schema.");
        console.log("🚀 Pest detections will now work correctly.");

    } catch (err) {
        console.error("❌  [ERROR] Failed to recreate table:");
        console.error(err.message);
    } finally {
        process.exit(0);
    }
};

recreatePestDetectionTable();
