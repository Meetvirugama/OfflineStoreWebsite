import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Apmc = sequelize.define("Apmc", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING, defaultValue: "Gujarat" },
    lat: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
    lng: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: "apmc",
    timestamps: false,
    indexes: [
        {
            name: "idx_apmc_location",
            fields: ["lat", "lng"]
        }
    ]
});

export default Apmc;
