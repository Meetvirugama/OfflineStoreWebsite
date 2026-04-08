import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Payment = sequelize.define("Payment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  method: { type: DataTypes.STRING, defaultValue: "RAZORPAY" },
  status: { type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"), defaultValue: "PENDING" },
  transaction_id: { type: DataTypes.STRING },
  razorpay_payment_id: { type: DataTypes.STRING }
}, {
  tableName: "payments",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default Payment;
