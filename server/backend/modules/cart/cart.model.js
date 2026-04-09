import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Cart = sequelize.define("Cart", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  status: { type: DataTypes.STRING, defaultValue: "ACTIVE" }
}, {
  tableName: "cart",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

export default Cart;
