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

export const listProducts = async ({ search, category, limit } = {}) => {
    const where = {};
    if (search) {
        where.name = { [Op.iLike]: `%${search}%` };
    }
    if (category) {
        where.category = category;
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
    return await sequelize.transaction(async (t) => {
        const product = await Product.findByPk(productId, { transaction: t });
        if (!product) throw new Error("Product not found");

        await Inventory.create({
            product_id: productId,
            quantity,
            type,
            note
        }, { transaction: t });

        // Update denormalized stock in product table
        const adjustment = type === "IN" ? quantity : -quantity;
        await product.increment("stock", { by: adjustment, transaction: t });
    });
};

export const getLowStock = async (threshold = 10) => {
    return await Product.findAll({
        where: {
            stock: { [Op.lt]: threshold }
        }
    });
};
