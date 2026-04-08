import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const MandiPrice = sequelize.define("MandiPrice", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    state: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    market: { type: DataTypes.STRING, allowNull: false },
    commodity: { type: DataTypes.STRING, allowNull: false },

    min_price: { type: DataTypes.FLOAT, allowNull: false },
    max_price: { type: DataTypes.FLOAT, allowNull: false },
    modal_price: { type: DataTypes.FLOAT, allowNull: false },
    
    arrival_date: { type: DataTypes.DATEONLY, allowNull: false },

    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }

}, {
    tableName: "mandi_prices",
    timestamps: false,
    indexes: [
        {
            name: 'mandi_composite_unique',
            unique: true,
            fields: ['market', 'commodity', 'arrival_date']
        },
        { fields: ['state'] },
        { fields: ['district'] },
        { fields: ['commodity'] },
        { fields: ['arrival_date'] }
    ]
});

export default MandiPrice;
