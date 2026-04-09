import { Sequelize } from 'sequelize';
import { ENV } from './env.js';

const DATABASE_URL = ENV.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL missing. Database connection will fail.");
    console.log("Current ENV:", JSON.stringify(ENV, null, 2));
}

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // For Supabase/Heroku/AWS
        },
    },
});

export default sequelize;
