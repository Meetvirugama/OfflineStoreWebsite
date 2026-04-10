import { Sequelize } from 'sequelize';
import { ENV } from './env.js';

const DATABASE_URL = ENV.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL missing. Database connection will fail.");
    console.log("Current ENV:", JSON.stringify(ENV, null, 2));
}

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
        keepAlive: true,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 60000, // Increase to 60s for slow DNS
        idle: 10000,
    },
    retry: {
        match: [
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/,
            /TimeoutError/,
            /EAI_AGAIN/
        ],
        max: 5, // Retry up to 5 times before failing
    },
});

export default sequelize;
