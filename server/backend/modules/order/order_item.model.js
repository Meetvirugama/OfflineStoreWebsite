import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price_at_purchase: { type: DataTypes.FLOAT, allowNull: false }
}, {
  tableName: "order_items",
  timestamps: false
});

export default OrderItem;
