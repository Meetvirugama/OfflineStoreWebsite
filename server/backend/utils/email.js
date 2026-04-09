import nodemailer from "nodemailer";

/**
 * Global Email Utility for AgroMart ERP
 * Uses SMTP (Gmail App Password) for digital communication
 */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"AgroMart 🌾" <${process.env.EMAIL}>`,
            to,
            subject,
            text,
            html,
        });
        console.log(`[EMAIL] Message sent: %s`, info.messageId);
        return info;
    } catch (error) {
        console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, error);
        throw error;
    }
};

export const getOrderConfirmationTemplate = (order, customerName) => {
    const itemsHtml = order.OrderItems.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.Product.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price.toFixed(2)}</td>
        </tr>
    `).join("");

    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e8ed; border-radius: 12px; overflow: hidden;">
            <div style="background: #059669; padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">Order Confirmed! 🌾</h1>
            </div>
            <div style="padding: 30px;">
                <p>Hello <strong>${customerName}</strong>,</p>
                <p>Thank you for your order. We are preparing your supplies for dispatch.</p>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Order ID:</strong> #${order.id}</p>
                    <p style="margin: 5px 0 0;"><strong>Total Amount:</strong> ₹${order.final_amount.toFixed(2)}</p>
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding: 10px; background: #f1f5f9;">Product</th>
                            <th style="text-align: left; padding: 10px; background: #f1f5f9;">Qty</th>
                            <th style="text-align: left; padding: 10px; background: #f1f5f9;">Price</th>
                        </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                </table>
                <p style="margin-top: 30px;">You can track your order in your <a href="https://agromart-erp.vercel.app/orders" style="color: #059669; font-weight: bold;">Farmer Dashboard</a>.</p>
            </div>
            <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
                © 2026 AgroMart ERP. All rights reserved.
            </div>
        </div>
    `;
};
