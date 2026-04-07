import { Inventory, Product } from "../models/index.js";
import Sequelize from "sequelize";
import sequelize from "../config/db.js";

export const getAvailableStock = async (product_id) => {
    const product = await Product.findByPk(product_id, {
        attributes: ["stock"]
    });
    return product ? (product.stock || 0) : 0;
};

export const adjustStockService = async (product_id, quantity, type, reference_type, reference_id) => {
    const t = await sequelize.transaction();

    try {
        const product = await Product.findByPk(product_id, { transaction: t });
        if (!product) throw new Error("Product not found");

        const qtyInt = parseInt(quantity, 10);
        if (isNaN(qtyInt) || qtyInt <= 0) throw new Error("Quantity must be a positive integer");

        const quantity_change = type === "OUT" ? -qtyInt : qtyInt;

        if (type === "OUT" && product.stock + quantity_change < 0) {
            throw new Error(`Insufficient stock for product ${product.name}`);
        }

        const inventory = await Inventory.create({
            product_id,
            quantity_change,
            type,
            reference_type,
            reference_id
        }, { transaction: t });

        await product.update({
            stock: product.stock + quantity_change
        }, { transaction: t });

        await t.commit();
        return inventory;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};