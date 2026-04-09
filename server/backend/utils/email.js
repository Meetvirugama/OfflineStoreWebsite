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

const MASTER_WRAPPER = (title, content, subtext = "") => `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; text-align: center; color: white;">
            <div style="font-size: 32px; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px;">AgroMart 🌾</div>
            <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9;">${title}</div>
        </div>
        <div style="padding: 40px 30px;">
            ${content}
            <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #f1f5f9; color: #64748b; font-size: 13px; line-height: 1.6;">
                <p style="margin: 0;">${subtext || "For any assistance with your node, contact AgroMart Global Support."}</p>
            </div>
        </div>
        <div style="background: #f8fafc; padding: 25px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
            © 2026 AgroMart ERP System. Integrated Sourcing Technology.<br/>
            DA-IICT Research Park Node.
        </div>
    </div>
`;

export const getOrderConfirmationTemplate = (order, customerName) => {
    const itemsHtml = (order.OrderItems || []).map(item => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                <div style="font-weight: 700; color: #0f172a;">${item.Product.name}</div>
                <div style="font-size: 11px; color: #64748b;">Unit: ₹${item.price.toFixed(2)}</div>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700;">₹${item.total.toFixed(2)}</td>
        </tr>
    `).join("");

    const content = `
        <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 800; color: #0f172a;">Order Confirmed, ${customerName}!</h2>
        <p style="margin: 0 0 25px; font-size: 15px; line-height: 1.6; color: #475569;">
            Your sourcing request has been verified and registered in our central node. We are preparing your assets for immediate dispatch.
        </p>
        <div style="background: #f1f5f9; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Order ID</span>
                <span style="font-size: 14px; font-weight: 800; color: #0f172a;">#${order.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Status</span>
                <span style="font-size: 12px; font-weight: 800; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 99px;">CONFIRMED</span>
            </div>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: left; padding-bottom: 10px; border-bottom: 2px solid #0f172a; font-size: 12px;">ITEM</th>
                    <th style="text-align: center; padding-bottom: 10px; border-bottom: 2px solid #0f172a; font-size: 12px;">QTY</th>
                    <th style="text-align: right; padding-bottom: 10px; border-bottom: 2px solid #0f172a; font-size: 12px;">TOTAL</th>
                </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
        </table>
        <div style="margin-top: 25px; text-align: right;">
            <span style="font-size: 18px; font-weight: 800; color: #0f172a;">Grand Total: ₹${order.final_amount.toFixed(2)}</span>
        </div>
        <div style="margin-top: 40px; text-align: center;">
            <a href="https://agromart-erp.vercel.app/orders" style="background: #059669; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);">Manage Orders in Dashboard</a>
        </div>
    `;
    return MASTER_WRAPPER("Security & Sourcing Confirmation", content);
};

export const getOTPTemplate = (otp, name) => {
    const content = `
        <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 800; color: #0f172a;">Verify Your Account</h2>
        <p style="margin: 0 0 30px; font-size: 15px; line-height: 1.6; color: #475569;">
            Hello ${name}, use the following identification code to activate your AgroMart node and access our executive agriculture network.
        </p>
        <div style="background: #f8fafc; padding: 35px; border-radius: 12px; text-align: center; border: 1px dashed #cbd5e1;">
            <div style="font-size: 42px; font-weight: 800; letter-spacing: 8px; color: #059669; font-family: monospace;">${otp}</div>
            <div style="margin-top: 15px; font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Code expires in 10 minutes</div>
        </div>
    `;
    return MASTER_WRAPPER("Identity Verification", content, "If you did not initiate this request, please secure your account immediately.");
};

export const getRecoveryTemplate = (otp, name) => {
    const content = `
        <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 800; color: #0f172a;">Account Recovery Request</h2>
        <p style="margin: 0 0 30px; font-size: 15px; line-height: 1.6; color: #475569;">
            Hello ${name}, we received a request to restore access to your AgroMart account. Use the secure code below to set a new password.
        </p>
        <div style="background: #fff1f2; padding: 35px; border-radius: 12px; text-align: center; border: 1px dashed #fecdd3;">
            <div style="font-size: 42px; font-weight: 800; letter-spacing: 8px; color: #e11d48; font-family: monospace;">${otp}</div>
            <div style="margin-top: 15px; font-size: 12px; font-weight: 600; color: #f43f5e; text-transform: uppercase;">Safety warning: Valid for 10 minutes only</div>
        </div>
    `;
    return MASTER_WRAPPER("Security Alert & Recovery", content, "If you did not request a password reset, you can safely ignore this email.");
};

export const getOrderReceiptTemplate = (order, name, amount, mode) => {
    const content = `
        <h2 style="margin: 0 0 10px; font-size: 20px; font-weight: 800; color: #0f172a;">Payment Successfully Processed</h2>
        <p style="margin: 0 0 30px; font-size: 14px; font-weight: 600; color: #059669;">TRANSACTION VERIFIED & SETTLED</p>
        
        <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <div style="font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 5px;">₹${Number(amount).toFixed(2)}</div>
            <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Received via ${mode}</div>
        </div>

        <div style="border-top: 2px solid #f1f5f9; padding-top: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-size: 13px; color: #64748b;">Order Reference:</span>
                <span style="font-size: 13px; font-weight: 700; color: #0f172a;">#${order.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-size: 13px; color: #64748b;">Transaction Date:</span>
                <span style="font-size: 13px; font-weight: 700; color: #0f172a;">${new Date().toLocaleDateString()}</span>
            </div>
        </div>
    `;
    return MASTER_WRAPPER("Digital Payment Receipt", content);
};

export const getPaymentReminderTemplate = (order, name, balance) => {
    const content = `
        <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 800; color: #0f172a;">Payment Balance Notification</h2>
        <p style="margin: 0 0 30px; font-size: 15px; line-height: 1.6; color: #475569;">
            Hello ${name}, our records indicate an outstanding balance for your recent sourcing request. Access the dashboard to settle the ledger.
        </p>
        <div style="background: #fff7ed; padding: 30px; border-radius: 12px; margin-bottom: 40px; border: 1px solid #ffedd5;">
            <div style="font-size: 12px; font-weight: 700; color: #9a3412; text-transform: uppercase; margin-bottom: 10px;">Amount Outstanding</div>
            <div style="font-size: 36px; font-weight: 800; color: #c2410c;">₹${Number(balance).toFixed(2)}</div>
            <div style="margin-top: 15px; font-size: 13px; color: #9a3412;">Order Reference: <strong>#${order.id}</strong></div>
        </div>
        <div style="text-align: center;">
            <a href="https://agromart-erp.vercel.app/orders/${order.id}" style="background: #0f172a; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Review & Settle Ledger Now</a>
        </div>
    `;
    return MASTER_WRAPPER("Financial Ledger Alert", content);
};
