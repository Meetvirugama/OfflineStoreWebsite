import sequelize from "../../config/db.js";
import Order from "./order.model.js";
import OrderItem from "./order_item.model.js";
import Product from "../product/product.model.js";
import * as cartService from "../cart/cart.service.js";

export const createFromCart = async (userId) => {
    const { items: cartItems } = await cartService.getCart(userId);
    if (!cartItems.length) throw new Error("Cart is empty");

    const t = await sequelize.transaction();
    try {
        let total = 0;
        const itemsToCreate = [];

        for (const item of cartItems) {
            const product = await Product.findByPk(item.product_id, { transaction: t });
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }

            total += product.price * item.quantity;
            itemsToCreate.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_purchase: product.price
            });

            // Update Stock
            await product.decrement("stock", { by: item.quantity, transaction: t });
        }

        const order = await Order.create({
            user_id: userId,
            total_amount: total,
            status: "PENDING"
        }, { transaction: t });

        for (const item of itemsToCreate) {
            await OrderItem.create({ ...item, order_id: order.id }, { transaction: t });
        }

        await cartService.clearCart(userId, t);
        await t.commit();
        
        return order;
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

export const getUserOrders = async (userId) => {
    return await Order.findAll({
        where: { user_id: userId },
        include: [{ model: OrderItem, include: [Product] }]
    });
};
