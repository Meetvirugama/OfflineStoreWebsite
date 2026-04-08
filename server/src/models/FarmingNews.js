import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const FarmingNews = sequelize.define("FarmingNews", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM("news", "announcement"),
    defaultValue: "news",
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  link: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  priority: {
    type: DataTypes.ENUM("NORMAL", "HIGH"),
    defaultValue: "NORMAL",
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: "General",
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: "farming_news",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default FarmingNews;
