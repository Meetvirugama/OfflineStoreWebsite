import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT },
  total: { type: DataTypes.FLOAT }
}, {
  tableName: "order_item",
  timestamps: false
});

export default OrderItem;
