import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define("Product", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING, allowNull: false },

    category: DataTypes.STRING,
    brand: DataTypes.STRING,

    mrp: DataTypes.FLOAT,
    selling_price: DataTypes.FLOAT,
    cost_price: DataTypes.FLOAT,

    unit: DataTypes.STRING,
    batch_number: DataTypes.STRING,
    expiry_date: DataTypes.DATE,

    image: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },

    supplier_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "supplier",
            key: "id"
        }
    },

    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    tableName: "product",
    timestamps: false
});

export default Product;