import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Analytics = sequelize.define(
  "Analytics",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM("VISIT", "CLICK"),
      allowNull: false,
    },
    page: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "analytics",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Analytics;