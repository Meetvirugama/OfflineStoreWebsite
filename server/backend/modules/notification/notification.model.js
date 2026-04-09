import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Notification = sequelize.define("Notification", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: true },
  type: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  reference_id: { type: DataTypes.INTEGER },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_opened: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_clicked: { type: DataTypes.BOOLEAN, defaultValue: false },
  opened_at: { type: DataTypes.DATE },
  clicked_at: { type: DataTypes.DATE },
  created_at: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: "notification",
  timestamps: false
});

export default Notification;
