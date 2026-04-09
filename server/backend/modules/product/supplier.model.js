import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Supplier = sequelize.define("Supplier", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  mobile: { type: DataTypes.STRING }
}, {
  tableName: "supplier",
  timestamps: false
});

export default Supplier;
