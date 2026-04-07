import { DataTypes } from "sequelize";
import  sequelize from "../config/db.js";

export const Supplier = sequelize.define("Supplier", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  name: { type: DataTypes.STRING, allowNull: false },

  mobile: DataTypes.STRING

}, {
  tableName: "supplier",
  timestamps: false
});

export default Supplier;