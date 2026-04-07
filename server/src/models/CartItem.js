import { DataTypes } from "sequelize";
import  sequelize  from "../config/db.js";

export const CartItem = sequelize.define("CartItem", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }

}, {
    tableName: "cart_item",
    timestamps: false
});

export default CartItem;