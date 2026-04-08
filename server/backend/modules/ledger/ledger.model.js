import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Ledger = sequelize.define("Ledger", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  customer_id: { type: DataTypes.INTEGER },
  type: { type: DataTypes.ENUM("DEBIT", "CREDIT"), allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  balance_after: { type: DataTypes.FLOAT },
  reference_type: { type: DataTypes.STRING }, // ORDER, PAYMENT, ADJUSTMENT
  reference_id: { type: DataTypes.INTEGER },
  description: { type: DataTypes.STRING }
}, {
  tableName: "ledger",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default Ledger;
