import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const OrderItem = sequelize.define("OrderItem", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },

    quantity: { type: DataTypes.INTEGER, allowNull: false },

    price: DataTypes.FLOAT,
    total: DataTypes.FLOAT

}, {
    tableName: "order_item",  // ✅ FIXED
    timestamps: false
});

export default OrderItem;