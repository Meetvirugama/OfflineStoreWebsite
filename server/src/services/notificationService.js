import sequelize from "../config/db.js";
import { Notification } from "../models/Notification.js";
import { sendEmail, sendOrderConfirmationEmail } from "./emailService.js";
import { getNotificationEmailTemplate, getPaymentDueEmailTemplate } from "../utils/emailTemplates.js";

/* =========================
   📧 MESSAGE ENGINE (retry)
========================= */
const sendMessage = async (customer_id, message, retry = 2) => {
    try {
        const [target] = await sequelize.query(`
            SELECT 
                COALESCE(c.email, u.email) as email,
                COALESCE(c.name, u.name) as name
            FROM customer c
            LEFT JOIN users u ON u.id = c.user_id
            WHERE c.id = :customer_id
        `, { replacements: { customer_id }, type: sequelize.QueryTypes.SELECT });

        if (target && target.email) {
            await sendEmail(
                target.email,
                "AgroMart Notification 🌿",
                getNotificationEmailTemplate(message, target.name)
            );
        }
    } catch (err) {
        if (retry > 0) return sendMessage(customer_id, message, retry - 1);
        console.error("❌ Email failed:", err.message);
    }
};

const sendPaymentDueMessage = async (customer_id, order_id, amount, due_date, retry = 2) => {
    try {
        const [target] = await sequelize.query(`
            SELECT 
                COALESCE(c.email, u.email) as email,
                COALESCE(c.name, u.name) as name
            FROM customer c
            LEFT JOIN users u ON u.id = c.user_id
            WHERE c.id = :customer_id
        `, { replacements: { customer_id }, type: sequelize.QueryTypes.SELECT });

        if (target && target.email) {
            await sendEmail(
                target.email,
                "⚠️ Action Required: Payment Due - AgroMart",
                getPaymentDueEmailTemplate(target.name, order_id, amount, due_date)
            );
        }
    } catch (err) {
        if (retry > 0) return sendPaymentDueMessage(customer_id, order_id, amount, due_date, retry - 1);
        console.error("❌ Payment Due Email failed:", err.message);
    }
};

/* =========================
   🔥 MAIN ENGINE
========================= */
export const runEngine = async () => {

    // LOW STOCK
    const [low] = await sequelize.query(`
        SELECT product_id, SUM(quantity_change) stock
        FROM inventory
        GROUP BY product_id
        HAVING SUM(quantity_change) < 10
    `);

    for (let i of low) {
        await Notification.create({
            type: "LOW_STOCK",
            message: `⚠️ Low stock for Product ${i.product_id}`,
            reference_id: i.product_id
        });
    }

    // PAYMENT DUE
    const [orders] = await sequelize.query(`
        SELECT id, customer_id, final_amount, due_date
        FROM orders
        WHERE due_date < CURRENT_DATE AND status != 'PAID'
    `);

    for (let o of orders) {
        const msg = `💰 Payment due for Order #${o.id} (₹${o.final_amount})`;

        await Notification.create({
            type: "PAYMENT_DUE",
            message: msg,
            reference_id: o.id
        });

        await sendPaymentDueMessage(o.customer_id, o.id, o.final_amount, o.due_date);
    }

    // EXPIRY PRODUCTS
    const [exp] = await sequelize.query(`
        SELECT id, name FROM product
        WHERE expiry_date <= CURRENT_DATE + INTERVAL '7 days'
        AND expiry_date IS NOT NULL
    `);

    for (let p of exp) {
        await Notification.create({
            type: "EXPIRY",
            message: `⏳ Product "${p.name}" expiring soon`,
            reference_id: p.id
        });
    }

    // 🌿 AGRI ALERTS: PRICE SURGE
    const [surges] = await sequelize.query(`
        SELECT commodity, AVG(modal_price) avg_p
        FROM mandi_prices
        WHERE arrival_date >= CURRENT_DATE - INTERVAL '3 days'
        GROUP BY commodity
        HAVING AVG(modal_price) > (
            SELECT AVG(modal_price) 
            FROM mandi_prices 
            WHERE arrival_date < CURRENT_DATE - INTERVAL '3 days'
        ) * 1.2
    `);

    for (let s of surges) {
        await Notification.create({
            type: "PRICE_SURGE",
            message: `📈 Price Surge! ${s.commodity} prices increased by over 20% lately.`,
            reference_id: s.commodity
        });
    }
};


/* =========================
   🤖 AI SYSTEM
========================= */
export const runAI = async () => {

    const [customers] = await sequelize.query(`
        SELECT c.id, c.name,
        COUNT(o.id) orders,
        SUM(o.final_amount) spent,
        MAX(o.order_date) last_order
        FROM customer c
        LEFT JOIN orders o ON o.customer_id = c.id
        GROUP BY c.id
    `);

    for (let c of customers) {

        if (c.spent > 50000) {
            const msg = `🌟 VIP Offer for ${c.name}`;
            await Notification.create({ type: "VIP", message: msg });
            await sendMessage(c.id, msg);
        }

        if (c.orders >= 10) {
            const msg = `🔥 Loyal Customer Reward`;
            await Notification.create({ type: "LOYAL", message: msg });
            await sendMessage(c.id, msg);
        }

        if (c.last_order && new Date(c.last_order) < new Date(Date.now() - 30*24*60*60*1000)) {
            const msg = `👋 We miss you ${c.name}, come back for offers`;
            await Notification.create({ type: "INACTIVE", message: msg });
            await sendMessage(c.id, msg);
        }
    }
};

/* =========================
   📦 ORDER EVENTS
========================= */
export const orderEvent = async (order) => {
    try {
        const msg = `🛒 Order #${order.id} placed successfully.`;

        await Notification.create({
            type: "ORDER",
            message: msg,
            reference_id: order.id
        });

        // 🔍 Fetch Customer Email (Check Customer table first, then User table)
        const [target] = await sequelize.query(`
            SELECT 
                COALESCE(c.email, u.email) as email,
                COALESCE(c.name, u.name) as name
            FROM customer c
            LEFT JOIN users u ON u.id = c.user_id
            WHERE c.id = :customer_id
        `, { replacements: { customer_id: order.customer_id }, type: sequelize.QueryTypes.SELECT });

        if (target && target.email) {
            await sendOrderConfirmationEmail(target, order);
        }
    } catch (err) {
        console.error("❌ Order confirmation email failed:", err.message);
    }
};

export const paymentEvent = async (order_id, customer_id, amount, status) => {
    const msg = `💰 Payment of ₹${amount} received for Order #${order_id}. Status is now ${status}.`;

    await Notification.create({
        type: "PAYMENT",
        message: msg,
        reference_id: order_id
    });

    await sendMessage(customer_id, msg);
};

export const invoiceEvent = async (order_id, customer_id, invoice_number) => {
    const msg = `🧾 Invoice ${invoice_number} generated for Order #${order_id}.`;

    await Notification.create({
        type: "INVOICE",
        message: msg,
        reference_id: order_id
    });
};

export const sendManualOrderReminder = async (orderId) => {
    // 🔥 FIX: Import Orders and sendPaymentDueMessage correctly
    const order = await sequelize.query(`
        SELECT id, customer_id, final_amount, due_date, status 
        FROM orders WHERE id = :orderId
    `, { replacements: { orderId }, type: sequelize.QueryTypes.SELECT });

    if (!order.length) throw new Error("Order not found");
    const o = order[0];

    if (o.status === 'PAID') throw new Error("Order already paid");

    const msg = `🔔 Payment reminder for Order #${o.id} (₹${o.final_amount})`;

    await Notification.create({
        type: "PAYMENT_DUE",
        message: msg,
        reference_id: o.id
    });

    await sendPaymentDueMessage(o.customer_id, o.id, o.final_amount, o.due_date);
};

/* =========================
   📊 ANALYTICS
========================= */
export const getAnalytics = async () => {
    const [data] = await sequelize.query(`
        SELECT
        COUNT(*) total,
        SUM(CASE WHEN is_opened THEN 1 ELSE 0 END) opened,
        SUM(CASE WHEN is_clicked THEN 1 ELSE 0 END) clicked,
        SUM(CASE WHEN is_read THEN 1 ELSE 0 END) read
        FROM notification
    `);

    return data[0];
};