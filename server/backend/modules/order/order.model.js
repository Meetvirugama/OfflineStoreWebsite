import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  customer_id: { type: DataTypes.INTEGER }, // optional link to CRM customer
  total_amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM("PENDING", "COMPLETED", "CANCELLED"), defaultValue: "PENDING" },
  payment_status: { type: DataTypes.ENUM("UNPAID", "PAID"), defaultValue: "UNPAID" },
  razorpay_order_id: { type: DataTypes.STRING }
}, {
  tableName: "orders",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default Order;
