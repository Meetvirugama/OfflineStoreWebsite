import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Cart = sequelize.define("Cart", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true }
}, {
  tableName: "cart",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default Cart;
