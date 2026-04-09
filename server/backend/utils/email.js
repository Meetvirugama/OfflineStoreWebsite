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

export const verifySMTP = () => transporter.verify();

export const sendEmail = async (to, subject, text, html, attachments = []) => {
    console.log(`[EMAIL] Attempting to send transmission to ${to}...`);
    try {
        const info = await transporter.sendMail({
            from: `"AgroMart 🌾" <${process.env.EMAIL}>`,
            to,
            subject,
            text,
            html,
            attachments
        });
        console.log(`[EMAIL] Message sent: %s`, info.messageId);
        return info;
    } catch (error) {
        console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, error);
        throw error;
    }
};

const MASTER_WRAPPER = (title, content, subtext = "") => `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; background-color: #ffffff; color: #1e293b; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 50px 30px; text-align: center; color: white;">
            <div style="font-size: 36px; font-weight: 900; letter-spacing: -1.5px; margin-bottom: 5px;">AgroMart 🌾</div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700; opacity: 0.9;">${title}</div>
        </div>
        <div style="padding: 45px 35px;">
            ${content}
            <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #f1f5f9; color: #64748b; font-size: 13px; line-height: 1.6; text-align: center;">
                <p style="margin: 0; font-weight: 500;">${subtext || "Need help? Contact our elite support node in the dashboard."}</p>
            </div>
        </div>
        <div style="background: #f8fafc; padding: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; line-height: 1.8;">
            <strong>AgroMart ERP System</strong> • Decentralized Agriculture Infrastructure<br/>
            DA-IICT Research Park Node • Gujarat, India<br/>
            <div style="margin-top: 10px; opacity: 0.7;">This is an automated operational transmission. Please do not reply.</div>
        </div>
    </div>
`;

export const getWelcomeTemplate = (name) => {
    const content = `
        <h2 style="margin: 0 0 15px; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">Welcome to the Network, ${name}!</h2>
        <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.6; color: #475569;">
            Your node has been successfully activated within the AgroMart ecosystem. You now have full access to our executive sourcing tools, mandi intelligence, and financial ledgers.
        </p>
        <div style="margin-top: 35px; text-align: center;">
            <a href="https://agromart-erp.vercel.app/dashboard" style="background: #059669; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.4);">Enter Your Dashboard</a>
        </div>
    `;
    return MASTER_WRAPPER("Onboarding Activation", content);
};

export const getOrderConfirmationTemplate = (order, customerName) => {
    const itemsHtml = (order.OrderItems || []).map(item => `
        <tr>
            <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                <div style="font-weight: 700; color: #0f172a; font-size: 14px;">${item.Product.name}</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Unit: ₹${item.price.toFixed(2)}</div>
            </td>
            <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; text-align: center; color: #475569;">x${item.quantity}</td>
            <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; color: #0f172a;">₹${item.total.toFixed(2)}</td>
        </tr>
    `).join("");

    const content = `
        <h2 style="margin: 0 0 15px; font-size: 22px; font-weight: 800; color: #0f172a;">Sourcing Order Registered!</h2>
        <p style="margin: 0 0 30px; font-size: 15px; line-height: 1.6; color: #475569;">
            Hello ${customerName}, your request <strong>#${order.id}</strong> has been verified. We are syncing with our warehouse nodes to prepare your shipment.
        </p>
        <div style="background: #f1f5f9; padding: 30px; border-radius: 16px; margin-bottom: 35px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center;">
                <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Order Reference</span>
                <span style="font-size: 15px; font-weight: 900; color: #0f172a;">#${order.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Lifecycle Status</span>
                <span style="font-size: 11px; font-weight: 900; color: #059669; background: #d1fae5; padding: 4px 12px; border-radius: 20px;">CONFIRMED</span>
            </div>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: left; padding-bottom: 12px; border-bottom: 2px solid #0f172a; font-size: 11px; color: #0f172a; text-transform: uppercase; letter-spacing: 1px;">Item Details</th>
                    <th style="text-align: center; padding-bottom: 12px; border-bottom: 2px solid #0f172a; font-size: 11px; color: #0f172a; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                    <th style="text-align: right; padding-bottom: 12px; border-bottom: 2px solid #0f172a; font-size: 11px; color: #0f172a; text-transform: uppercase; letter-spacing: 1px;">Value</th>
                </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
        </table>
        <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 12px; text-align: right;">
            <div style="font-size: 13px; color: #64748b; margin-bottom: 5px;">Subtotal: ₹${order.total_amount.toFixed(2)}</div>
            <div style="font-size: 13px; color: #64748b; margin-bottom: 10px;">GST (18%): ₹${(order.gst_total || 0).toFixed(2)}</div>
            <div style="font-size: 20px; font-weight: 900; color: #0f172a;">Grand Total: ₹${order.final_amount.toFixed(2)}</div>
        </div>
    `;
    return MASTER_WRAPPER("Order Lifecycle Confirmation", content, "View real-time transit updates in your executive dashboard.");
};

export const getOTPTemplate = (otp, name) => {
    const content = `
        <h2 style="margin: 0 0 15px; font-size: 22px; font-weight: 800; color: #0f172a;">Identity Authentication</h2>
        <p style="margin: 0 0 30px; font-size: 15px; line-height: 1.6; color: #475569;">
            Hello ${name}, use the secure authorization code below to verify your session and access the AgroMart network.
        </p>
        <div style="background: #f8fafc; padding: 40px; border-radius: 20px; text-align: center; border: 2px solid #e2e8f0; position: relative; overflow: hidden;">
            <div style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #059669; font-family: 'Courier New', Courier, monospace;">${otp}</div>
            <div style="margin-top: 20px; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">Expires in 10 minutes</div>
        </div>
    `;
    return MASTER_WRAPPER("Secure Access Verification", content, "Security Note: Our staff will never ask for this code over the phone or email.");
};

export const getRecoveryTemplate = (otp, name) => {
    const content = `
        <h2 style="margin: 0 0 15px; font-size: 22px; font-weight: 800; color: #0f172a;">Password Restoration</h2>
        <p style="margin: 0 0 30px; font-size: 15px; line-height: 1.6; color: #475569;">
            Hello ${name}, we received a request to bypass your current credentials. Use the recovery code as a one-time key to set your new password.
        </p>
        <div style="background: #fff1f2; padding: 40px; border-radius: 20px; text-align: center; border: 2px solid #fecdd3;">
            <div style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #e11d48; font-family: 'Courier New', Courier, monospace;">${otp}</div>
            <div style="margin-top: 20px; font-size: 11px; font-weight: 800; color: #f43f5e; text-transform: uppercase; letter-spacing: 2px;">Valid for 10 minutes</div>
        </div>
    `;
    return MASTER_WRAPPER("Account Security Recovery", content, "If you did not request this, please change your password immediately to secure your node.");
};

export const getOrderReceiptTemplate = (order, name, amount, mode) => {
    const content = `
        <h2 style="margin: 0 0 10px; font-size: 22px; font-weight: 800; color: #0f172a;">Payment Succeeded</h2>
        <div style="display: inline-block; background: #d1fae5; color: #059669; font-size: 11px; font-weight: 900; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 25px;">Verified Transaction</div>
        
        <div style="background: #f8fafc; padding: 40px; border-radius: 20px; text-align: center; margin-bottom: 35px; border: 1px solid #e2e8f0;">
            <div style="font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px; text-transform: uppercase;">Amount Processed</div>
            <div style="font-size: 42px; font-weight: 900; color: #0f172a;">₹${Number(amount).toFixed(2)}</div>
            <div style="margin-top: 15px; font-size: 12px; font-weight: 700; color: #059669; background: #ffffff; display: inline-block; padding: 6px 16px; border-radius: 12px; border: 1px solid #d1fae5;">Received via ${mode}</div>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 25px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 14px; color: #64748b;">Order Node:</span>
                <span style="font-size: 14px; font-weight: 700; color: #0f172a;">#${order.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 14px; color: #64748b;">Settlement Date:</span>
                <span style="font-size: 14px; font-weight: 700; color: #0f172a;">${new Date().toLocaleDateString()}</span>
            </div>
        </div>
    `;
    return MASTER_WRAPPER("Digital Financial Receipt", content);
};

export const getInvoiceSettledTemplate = (order, name) => {
    const content = `
        <h2 style="margin: 0 0 15px; font-size: 22px; font-weight: 800; color: #0f172a;">Ledger Fully Settled ✅</h2>
        <p style="margin: 0 0 30px; font-size: 15px; line-height: 1.6; color: #475569;">
            Success! Your order <strong>#${order.id}</strong> is now fully paid and settled in our system. We have attached your official digital invoice to this email for your records.
        </p>
        <div style="background: #059669; padding: 30px; border-radius: 20px; text-align: center; color: white;">
            <div style="font-size: 13px; font-weight: 700; opacity: 0.9; margin-bottom: 10px; text-transform: uppercase;">Final Settlement Value</div>
            <div style="font-size: 36px; font-weight: 900;">₹${Number(order.final_amount).toFixed(2)}</div>
        </div>
        <div style="margin-top: 40px; text-align: center;">
            <p style="font-size: 13px; color: #64748b; margin-bottom: 20px;">You can also access your historical invoices in the dashboard.</p>
            <a href="https://agromart-erp.vercel.app/orders" style="background: #0f172a; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">Review Invoices</a>
        </div>
    `;
    return MASTER_WRAPPER("Official Tax Invoice Settled", content, "This settlement triggers final clearance for delivery if pending.");
};

export const getPaymentReminderTemplate = (order, name, balance) => {
    const content = `
        <h2 style="margin: 0 0 15px; font-size: 22px; font-weight: 800; color: #0f172a;">Financial Ledger Action Required</h2>
        <p style="margin: 0 0 30px; font-size: 15px; line-height: 1.6; color: #475569;">
            Hello ${name}, our audit shows an outstanding balance for order <strong>#${order.id}</strong>. Please settle the amount below to ensure uninterrupted service.
        </p>
        <div style="background: #fff7ed; padding: 40px; border-radius: 20px; margin-bottom: 35px; border: 2px solid #ffedd5; text-align: center;">
            <div style="font-size: 12px; font-weight: 800; color: #9a3412; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px;">Outstanding Amount</div>
            <div style="font-size: 42px; font-weight: 900; color: #c2410c;">₹${Number(balance).toFixed(2)}</div>
            <div style="margin-top: 20px; font-size: 13px; color: #9a3412;">Reference Order: <strong>#${order.id}</strong></div>
        </div>
        <div style="text-align: center;">
            <a href="https://agromart-erp.vercel.app/orders/${order.id}" style="background: #ea580c; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.4);">Settle Balance Immediately</a>
        </div>
    `;
    return MASTER_WRAPPER("Immediate Payment Alert", content, "Late settlement may affect your credit score in the AgroMart network.");
};
