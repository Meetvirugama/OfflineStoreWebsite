import Product from "./product.model.js";
import Inventory from "./inventory.model.js";
import Supplier from "./supplier.model.js";

export const createProduct = async (data) => {
    return await Product.create(data);
};

export const listProducts = async () => {
    return await Product.findAll();
};

export const getProductById = async (id) => {
    return await Product.findByPk(id);
};

export const updateStock = async (productId, quantity, type, note) => {
    const product = await Product.findByPk(productId);
    if (!product) throw new Error("Product not found");

    await Inventory.create({
        product_id: productId,
        quantity,
        type,
        note
    });

    // Update denormalized stock in product table
    const adjustment = type === "IN" ? quantity : -quantity;
    await product.increment("stock", { by: adjustment });
};

export const getLowStock = async (threshold = 10) => {
    return await Product.findAll({
        where: {
            stock: { [Op.lt]: threshold }
        }
    });
};
