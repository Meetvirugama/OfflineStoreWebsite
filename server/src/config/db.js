import { Sequelize } from "sequelize";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL missing. Database connection will fail.");
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export default sequelize;