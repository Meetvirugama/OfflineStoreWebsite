import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Supplier = sequelize.define("Supplier", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  contact_person: { type: DataTypes.STRING },
  mobile: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  gstin: { type: DataTypes.STRING }
}, {
  tableName: "suppliers",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default Supplier;
