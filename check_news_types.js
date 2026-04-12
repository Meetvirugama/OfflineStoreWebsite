const { News } = require('./server/backend/modules/news/news.model');
const sequelize = require('./server/backend/config/db');

async function checkTypes() {
    try {
        await sequelize.authenticate();
        const types = await sequelize.query("SELECT DISTINCT type FROM News", { type: sequelize.QueryTypes.SELECT });
        console.log("Distinct News Types:", JSON.stringify(types));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}
checkTypes();
