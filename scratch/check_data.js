
import sequelize from "../server/backend/config/db.js";
import MandiPrice from "../server/backend/modules/mandi/mandi.model.js";

async function checkData() {
    try {
        const records = await MandiPrice.findAll({ limit: 5 });
        console.log("Sample records:", JSON.stringify(records, null, 2));
        
        const dates = await MandiPrice.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('arrival_date')), 'arrival_date']
            ],
            order: [['arrival_date', 'DESC']],
            limit: 10
        });
        console.log("Unique dates in DB:", dates.map(d => d.arrival_date));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkData();
