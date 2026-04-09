import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Customer = sequelize.define("Customer", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true },
  mobile: { type: DataTypes.STRING, unique: true, allowNull: true },
  village: DataTypes.STRING,
  gst: DataTypes.STRING,
  credit_limit: { type: DataTypes.FLOAT, defaultValue: 0 },
  total_purchase: { type: DataTypes.FLOAT, defaultValue: 0 },
  total_paid: { type: DataTypes.FLOAT, defaultValue: 0 },
  total_due: { type: DataTypes.FLOAT, defaultValue: 0 },
  discount_percent: { type: DataTypes.FLOAT, defaultValue: 0 },
  tag: { type: DataTypes.STRING, defaultValue: "REGULAR" },
  credit_score: { type: DataTypes.INTEGER, defaultValue: 100 }
}, {
  tableName: "customer",
  timestamps: false
});

export default Customer;
