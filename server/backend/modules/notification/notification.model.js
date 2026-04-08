import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Notification = sequelize.define("Notification", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.ENUM("INFO", "WARNING", "SUCCESS", "ALERT"), defaultValue: "INFO" },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: "notifications",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default Notification;
