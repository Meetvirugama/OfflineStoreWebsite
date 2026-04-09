import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false },
  order_date: { type: DataTypes.DATE },
  total_amount: { type: DataTypes.FLOAT },
  discount: { type: DataTypes.FLOAT, defaultValue: 0 },
  cgst: { type: DataTypes.FLOAT, defaultValue: 0 },
  sgst: { type: DataTypes.FLOAT, defaultValue: 0 },
  igst: { type: DataTypes.FLOAT, defaultValue: 0 },
  gst_total: { type: DataTypes.FLOAT, defaultValue: 0 },
  final_amount: { type: DataTypes.FLOAT, defaultValue: 0 },
  paid_amount: { type: DataTypes.FLOAT, defaultValue: 0 },
  invoice_number: { type: DataTypes.STRING, unique: true },
  status: { type: DataTypes.STRING, defaultValue: "PENDING" },
  due_date: { type: DataTypes.DATE },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: "orders",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Order;
