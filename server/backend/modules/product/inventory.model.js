import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Inventory = sequelize.define("Inventory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: true },
  type: { type: DataTypes.STRING, allowNull: false }, // Use STRING for simplicity with custom ENUMs
  note: { type: DataTypes.STRING },
  reference_type: { type: DataTypes.STRING },
  reference_id: { type: DataTypes.INTEGER }
}, {
  tableName: "inventory",
  timestamps: false
});

export default Inventory;
