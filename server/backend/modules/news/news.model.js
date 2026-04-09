import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const News = sequelize.define("News", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  link: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING, defaultValue: "news" },
  published_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "farming_news",
  timestamps: false
});

export default News;
