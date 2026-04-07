import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Cart = sequelize.define("Cart", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "customer",
            key: "id"
        }
    },

    status: {
        type: DataTypes.ENUM("ACTIVE", "CHECKED_OUT"),
        defaultValue: "ACTIVE"
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {
    tableName: "cart",
    timestamps: false
});

export default Cart;