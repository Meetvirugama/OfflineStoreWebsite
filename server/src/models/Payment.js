import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Payment = sequelize.define("Payment", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    payment_mode: {
        type: DataTypes.ENUM("CASH", "UPI", "CARD", "BANK"),
        allowNull: false
    },

    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    reference_no: DataTypes.STRING,

    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    tableName: "payment",
    timestamps: false
});

export default Payment;