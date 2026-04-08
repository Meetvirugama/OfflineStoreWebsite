import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const WeatherCache = sequelize.define("WeatherCache", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  lat_lon_key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: "weather_cache",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default WeatherCache;
