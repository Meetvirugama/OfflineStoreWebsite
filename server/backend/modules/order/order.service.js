import sequelize from "../../config/db.js";
import Order from "./order.model.js";
import OrderItem from "./order_item.model.js";
import Product from "../product/product.model.js";
import Customer from "../customer/customer.model.js";
import * as cartService from "../cart/cart.service.js";

import User from "../user/user.model.js";

export const createFromCart = async (userId, incomingCustomerId) => {
    let customerId = incomingCustomerId;
    if (!customerId) {
        const customer = await Customer.findOne({ where: { user_id: userId } });
        if (!customer) throw new Error("Customer profile not found for this user");
        customerId = customer.id;
    }

    const { items: cartItems } = await cartService.getCart(userId);
    if (!cartItems.length) throw new Error("Cart is empty");

    const t = await sequelize.transaction();
    try {
        let total = 0;
        const itemsToCreate = [];

        for (const item of cartItems) {
            const product = await Product.findByPk(item.product_id, { transaction: t });
            if (!product) throw new Error(`Product #${item.product_id} not found`);
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
            customer_id: customerId,
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
        
        // 4. Notifications (Post-Commit)
        try {
            const { notify } = await import("../notification/notification.service.js");
            const { User: UserModel } = await import("../user/user.model.js");

            // User confirmation
            await notify(userId, "Order Confirmed! 🌾", `Your order #${order.id} for ₹${total.toFixed(2)} was placed successfully.`, "SUCCESS");

            // Admin alert
            const admins = await UserModel.findAll({ where: { role: "ADMIN" } });
            for (const admin of admins) {
                await notify(admin.id, "New Order Received 📦", `Order #${order.id} has been placed by a customer.`, "INFO");
            }
        } catch (err) {
            console.error("Delayed Notification Error:", err);
        }

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
        include: [
            { 
                model: Customer, 
                include: [{ model: User, attributes: ["name", "mobile", "email"] }] 
            }, 
            { 
                model: OrderItem, 
                include: [Product] 
            }
        ],
        order: [["createdAt", "DESC"]]
    });
};

export const updateOrderStatus = async (orderId, status) => {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");
    order.status = status;
    return await order.save();
};
