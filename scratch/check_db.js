
import sequelize from "../server/backend/config/db.js";
import MandiPrice from "../server/backend/modules/mandi/mandi.model.js";

async function checkDb() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        await MandiPrice.sync(); // Create table if it doesn't exist
        
        const count = await MandiPrice.count();
        console.log(`MandiPrice records: ${count}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

checkDb();
