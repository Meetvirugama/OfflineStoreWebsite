import { PurchaseItem } from "../models/index.js";
import { Inventory } from "../models/index.js";
import Product from "../models/Product.js";
import sequelize from "../config/db.js";

export const createPurchaseService = async (data) => {
    const { product_id, quantity } = data;

    if (!product_id || !quantity) {
        throw new Error("product_id and quantity required");
    }

    const product = await Product.findByPk(product_id);
    if (!product) throw new Error("Product not found");

    const t = await sequelize.transaction();

    try {
        // Create purchase item record
        const purchase = await PurchaseItem.create({
            product_id,
            quantity
        }, { transaction: t });

        // 🔥 FIX: Create Inventory IN record to update stock
        await Inventory.create({
            product_id,
            quantity_change: quantity,   // positive = IN
            type: "IN",
            reference_type: "PURCHASE",
            reference_id: purchase.id
        }, { transaction: t });

        await t.commit();

        return {
            message: "Stock added successfully",
            product_name: product.name,
            product_id,
            quantity_added: quantity,
            purchase_id: purchase.id
        };
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

export const getPurchasesService = async () => {
    return await PurchaseItem.findAll({
        include: [{ model: Product, attributes: ["id", "name", "category"] }],
        order: [["id", "DESC"]]
    });
};