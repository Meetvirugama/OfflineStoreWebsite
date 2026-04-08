import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Inventory = sequelize.define("Inventory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  supplier_id: { type: DataTypes.INTEGER },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM("IN", "OUT"), defaultValue: "IN" }, // IN (Purchase), OUT (Sale/Adjustment)
  note: { type: DataTypes.STRING }
}, {
  tableName: "inventory_logs",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default Inventory;
