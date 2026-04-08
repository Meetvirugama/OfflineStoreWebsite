import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const FarmerProfit = sequelize.define("FarmerProfit", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    crop_name: { type: DataTypes.STRING, allowNull: false },
    season: { type: DataTypes.STRING },
    investment: { type: DataTypes.FLOAT, defaultValue: 0 },
    revenue: { type: DataTypes.FLOAT, defaultValue: 0 },
    profit: { type: DataTypes.FLOAT, defaultValue: 0 },
    sold_at: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
}, {
    tableName: "farmer_profits",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default FarmerProfit;
