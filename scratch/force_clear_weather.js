import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false
});

async function clearCache() {
    try {
        console.log('--- CLEARING WEATHER CACHE ---');
        await sequelize.query('DELETE FROM "WeatherCaches"');
        console.log('Cache cleared successfully. Next request will pull from Google & Tomorrow.io');
        process.exit(0);
    } catch (err) {
        console.error('Error clearing cache:', err);
        process.exit(1);
    }
}

clearCache();
