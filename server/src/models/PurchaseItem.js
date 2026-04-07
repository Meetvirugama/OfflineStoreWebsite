import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const PurchaseItem = sequelize.define("PurchaseItem", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    product_id: { type: DataTypes.INTEGER, allowNull: false },

    quantity: { type: DataTypes.INTEGER, allowNull: false }

}, {
    tableName: "purchase_item",
    timestamps: false
});

export default PurchaseItem;