import { DataTypes } from "sequelize";
import sequelize  from "../config/db.js";

export const Inventory = sequelize.define("Inventory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  product_id: { type: DataTypes.INTEGER, allowNull: false },

  quantity_change: { type: DataTypes.INTEGER, allowNull: false },

  type: {
    type: DataTypes.ENUM("IN", "OUT"),
    allowNull: false
  },

  reference_type: DataTypes.STRING,
  reference_id: DataTypes.INTEGER

}, {
  tableName: "inventory",
  timestamps: false
});

export default Inventory;