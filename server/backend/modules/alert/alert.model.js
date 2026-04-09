import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const PriceAlert = sequelize.define("PriceAlert", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  commodity: { type: DataTypes.STRING, allowNull: false },
  target_price: { type: DataTypes.FLOAT, allowNull: false },
  condition: { type: DataTypes.ENUM("ABOVE", "BELOW"), defaultValue: "ABOVE" },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: "price_alert",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default PriceAlert;
