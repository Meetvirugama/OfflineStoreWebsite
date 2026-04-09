import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  brand: { type: DataTypes.STRING },
  mrp: { type: DataTypes.FLOAT },
  selling_price: { type: DataTypes.FLOAT },
  cost_price: { type: DataTypes.FLOAT },
  unit: { type: DataTypes.STRING },
  batch_number: { type: DataTypes.STRING },
  expiry_date: { type: DataTypes.DATE },
  image: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  supplier_id: { type: DataTypes.INTEGER },
  created_by: { type: DataTypes.INTEGER }
}, {
  tableName: "product",
  timestamps: false // The schema doesn't show standard timestamps but we can add them if we want to follow sequelize pattern, but user's SQL only showed created_at as DEFAULT now() in some tables. Let's see.
});

export default Product;
