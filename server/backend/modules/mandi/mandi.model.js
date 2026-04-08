import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const MandiPrice = sequelize.define("MandiPrice", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    state: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    market: { type: DataTypes.STRING, allowNull: false },
    commodity: { type: DataTypes.STRING, allowNull: false },
    min_price: { type: DataTypes.FLOAT, defaultValue: 0 },
    max_price: { type: DataTypes.FLOAT, defaultValue: 0 },
    modal_price: { type: DataTypes.FLOAT, defaultValue: 0 },
    arrival_date: { type: DataTypes.DATEONLY, allowNull: false }
}, {
    tableName: "mandi_prices",
    timestamps: false
});

export default MandiPrice;
