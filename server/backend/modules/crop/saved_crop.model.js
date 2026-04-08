import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const SavedCrop = sequelize.define("SavedCrop", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  crop_name: { type: DataTypes.STRING, allowNull: false },
  season: { type: DataTypes.STRING }, // Kharif, Rabi, Zaid
  area_acres: { type: DataTypes.FLOAT },
  planted_at: { type: DataTypes.DATEONLY },
  expected_harvest: { type: DataTypes.DATEONLY },
}, {
  tableName: "saved_crops",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default SavedCrop;
