import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  unit: { type: DataTypes.STRING, defaultValue: "kg" },
  image: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT }
}, {
  tableName: "products",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default Product;
