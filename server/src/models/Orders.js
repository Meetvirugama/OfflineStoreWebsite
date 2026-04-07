import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Orders = sequelize.define("Orders", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    customer_id: { type: DataTypes.INTEGER, allowNull: false },

    order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    total_amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    discount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    // 🔥 GST FIELDS
    cgst: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    sgst: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    igst: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    gst_total: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    final_amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    // ✅ Track running total paid — updated on every payment
    paid_amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    // 🔥 INVOICE
    invoice_number: {
        type: DataTypes.STRING,
        unique: true
    },

    status: {
        type: DataTypes.ENUM("PENDING", "PAID", "PARTIAL"),
        defaultValue: "PENDING"
    },

    due_date: DataTypes.DATE,

    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    tableName: "orders",
    timestamps: true
});

export default Orders;