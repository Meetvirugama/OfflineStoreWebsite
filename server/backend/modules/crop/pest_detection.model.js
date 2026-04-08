import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const PestDetection = sequelize.define("PestDetection", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  crop_name: { type: DataTypes.STRING, allowNull: false },
  disease_name: { type: DataTypes.STRING, allowNull: false },
  confidence: { type: DataTypes.FLOAT },
  image_url: { type: DataTypes.STRING },
  solution: { type: DataTypes.TEXT },
  organic_solution: { type: DataTypes.TEXT },
  severity: { type: DataTypes.STRING } // Low, Medium, High
}, {
  tableName: "pest_detections",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default PestDetection;
