import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Crop = sequelize.define("Crop", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    data: { type: DataTypes.JSONB, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: "crops",
    timestamps: false
});

export default Crop;
