import sequelize from "../config/db.js";
import { Customer, Product, OrderItem, Orders, Inventory } from "../models/index.js";
import { getAvailableStock } from "./inventoryService.js";
import { updateCustomerFinancials } from "./customerService.js";
import { addLedgerEntry } from "./ledgerService.js";
import { orderEvent } from "./notificationService.js";

// 🔥 GST CONFIG
const GST_RATE = 18;

// 🔥 GST FUNCTION
const calculateGST = (amount, isSameState = true) => {
    const gstAmount = (amount * GST_RATE) / 100;

    if (isSameState) {
        return {
            cgst: gstAmount / 2,
            sgst: gstAmount / 2,
            igst: 0,
            gst_total: gstAmount
        };
    } else {
        return {
            cgst: 0,
            sgst: 0,
            igst: gstAmount,
            gst_total: gstAmount
        };
    }
};

// 🔥 AUTO DISCOUNT
const getDiscountByAmount = (amount) => {
    if (amount >= 10000) return 15;
    if (amount >= 5000) return 10;
    if (amount >= 2000) return 5;
    return 0;
};

export const createOrderService = async (data) => {

    const { customer_id, items, discount = 0, due_date, created_by } = data;

    const t = await sequelize.transaction();

    try {
        // 🔍 Customer
        const customer = await Customer.findByPk(customer_id, { transaction: t });
        if (!customer) throw new Error("Customer not found");

        let total = 0;

        // 🧾 Validate items & calculate totals
        for (let item of items) {
            const product = await Product.findByPk(item.product_id, { transaction: t });
            if (!product) throw new Error(`Product not found: ${item.product_id}`);

            const stock = await getAvailableStock(item.product_id);
            if (stock < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }

            item.price = product.selling_price;
            item.total = item.price * item.quantity;
            total += item.total;
        }

        // 🔥 DISCOUNT
        const discountPercent = getDiscountByAmount(total);
        const autoDiscount = (total * discountPercent) / 100;
        const finalDiscount = discount + autoDiscount;
        const subtotal = total - finalDiscount;

        // 🔥 GST APPLY
        const gst = calculateGST(subtotal, true);
        const finalAmount = subtotal + gst.gst_total;

        // 📊 UPDATE CUSTOMER FINANCIALS
        await updateCustomerFinancials(customer_id, finalAmount, "DEBIT", t);

        // 🔥 INVOICE NUMBER (INSIDE TRANSACTION)
        const invoice_number = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

        // 🧾 CREATE ORDER
        const order = await Orders.create({
            customer_id,
            total_amount: total,
            discount: finalDiscount,
            final_amount: finalAmount,
            due_date,
            created_by,
            invoice_number,
            ...gst
        }, { transaction: t });

        // 🧾 ORDER ITEMS + 📦 INVENTORY OUT
        for (let item of items) {
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                total: item.total
            }, { transaction: t });

            // 🔥 FIX: Decrement inventory stock after each order item
            await Inventory.create({
                product_id: item.product_id,
                quantity_change: -item.quantity,  // negative = OUT
                type: "OUT",
                reference_type: "ORDER",
                reference_id: order.id
            }, { transaction: t });
        }

        // 💾 COMMIT
        await t.commit();

        await addLedgerEntry({
            customer_id,
            type: "DEBIT",
            amount: finalAmount,
            reference_type: "ORDER",
            reference_id: order.id,
            description: `Order #${order.id} created (GST + discount applied)`
        });

        // 🔔 TRIGGER EMAIL & NOTIFICATION
        orderEvent(order).catch(err => {
            console.error("Failed to send order notification:", err.message);
        });

        return {
            ...order.toJSON(),
            discount_percent: discountPercent,
            auto_discount: autoDiscount,
            manual_discount: discount,
            final_discount: finalDiscount
        };

    } catch (err) {
        await t.rollback();
        throw err;
    }
};

// GET ORDER BY ID WITH ITEMS
export const getOrderByIdService = async (orderId) => {
    const order = await Orders.findByPk(orderId, {
        include: [{
            model: OrderItem,
            as: "items",
            include: [{ model: Product, attributes: ["id", "name", "selling_price"] }]
        }]
    });

    if (!order) throw new Error("Order not found");
    return order;
};