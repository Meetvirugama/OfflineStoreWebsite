import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Ledger = sequelize.define("Ledger", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  customer_id: { type: DataTypes.INTEGER, allowNull: false },

  type: {
    type: DataTypes.ENUM("DEBIT", "CREDIT"),
    allowNull: false
  },

  amount: { type: DataTypes.FLOAT, allowNull: false },

  balance: DataTypes.FLOAT,

  reference_type: DataTypes.STRING,
  reference_id: DataTypes.INTEGER,

  description: DataTypes.STRING

}, {
  tableName: "ledger",
  timestamps: false
});

export default Ledger;