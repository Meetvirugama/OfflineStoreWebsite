import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Ledger = sequelize.define("Ledger", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  balance: { type: DataTypes.FLOAT },
  reference_type: { type: DataTypes.STRING },
  reference_id: { type: DataTypes.INTEGER },
  description: { type: DataTypes.STRING }
}, {
  tableName: "ledger",
  timestamps: false
});

export default Ledger;
