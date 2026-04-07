import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Notification = sequelize.define("notification", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: DataTypes.STRING,
    message: DataTypes.TEXT,
    reference_id: DataTypes.INTEGER,

    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_opened: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_clicked: { type: DataTypes.BOOLEAN, defaultValue: false },

    opened_at: DataTypes.DATE,
    clicked_at: DataTypes.DATE
}, {
    tableName: "notification",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});