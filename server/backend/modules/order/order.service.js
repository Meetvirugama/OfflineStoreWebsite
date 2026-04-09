import sequelize from "../../config/db.js";
import Order from "./order.model.js";
import OrderItem from "./order_item.model.js";
import Product from "../product/product.model.js";
import * as cartService from "../cart/cart.service.js";

export const createFromCart = async (userId, customerId) => {
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

            const itemPrice = product.selling_price || product.mrp;
            total += itemPrice * item.quantity;
            itemsToCreate.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: itemPrice,
                total: itemPrice * item.quantity
            });

            // Update Stock
            await product.decrement("stock", { by: item.quantity, transaction: t });
        }

        const order = await Order.create({
            customer_id: customerId || userId, // Fallback if no specific customer_id
            total_amount: total,
            final_amount: total, 
            status: "PENDING",
            created_by: userId,
            order_date: new Date()
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

export const getUserOrders = async (customerId) => {
    return await Order.findAll({
        where: { customer_id: customerId },
        include: [{ model: OrderItem, include: [Product] }]
    });
};

export const getAllOrders = async () => {
    return await Order.findAll({
        include: [{ model: OrderItem, include: [Product] }, { model: Product, as: 'Product' }] // Adjust based on associations
    });
};

export const updateOrderStatus = async (orderId, status) => {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");
    order.status = status;
    return await order.save();
};
