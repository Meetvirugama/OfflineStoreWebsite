import { Op } from "sequelize";
import sequelize from "../../config/db.js";
import Product from "./product.model.js";
import Inventory from "./inventory.model.js";
import Supplier from "./supplier.model.js";

export const getCategories = async () => {
    return await Product.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
        raw: true
    }).then(res => res.map(r => r.category).filter(Boolean));
};

export const createProduct = async (data) => {
    return await Product.create(data);
};

export const updateProduct = async (id, data) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");
    return await product.update(data);
};

export const deleteProduct = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");
    return await product.destroy();
};

export const listProducts = async ({ search, category, supplier_id, limit } = {}) => {
    const where = {};
    if (search) {
        where.name = { [Op.iLike]: `%${search}%` };
    }
    if (category) {
        where.category = category;
    }
    if (supplier_id) {
        where.supplier_id = supplier_id;
    }

    return await Product.findAll({
        where,
        limit: limit ? Number(limit) : undefined,
        order: [["id", "DESC"]]
    });
};

export const getProductById = async (id) => {
    return await Product.findByPk(id);
};

export const updateStock = async (productId, quantity, type, note) => {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) throw new Error("Invalid quantity for stock adjustment");

    return await sequelize.transaction(async (t) => {
        const product = await Product.findByPk(productId, { transaction: t });
        if (!product) throw new Error("Product not found");
        
        // Ensure stock is at least 0 if it was somehow NULL
        if (product.stock === null) {
            await product.update({ stock: 0 }, { transaction: t });
        }

        await Inventory.create({
            product_id: productId,
            quantity: qty,
            type: type.toUpperCase(),
            note: note || "Manual Adjustment"
        }, { transaction: t });

        const adjustment = type.toUpperCase() === "IN" ? qty : -qty;
        
        // Use static increment for better transaction reliability
        await Product.increment("stock", { 
            by: adjustment, 
            where: { id: productId }, 
            transaction: t 
        });
    });
};

export const getLowStock = async (threshold = 10) => {
    return await Product.findAll({
        where: {
            stock: { [Op.lt]: threshold }
        }
    });
};
