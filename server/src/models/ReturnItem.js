import { DataTypes } from "sequelize";
import  sequelize  from "../config/db.js";

export const ReturnItem = sequelize.define("ReturnItem", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    return_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2)
    }

}, {
    timestamps: false
});
