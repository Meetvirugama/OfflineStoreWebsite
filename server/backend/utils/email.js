import nodemailer from "nodemailer";

/**
 * Global Email Utility for AgroMart ERP
 * Uses SMTP (Gmail App Password) for digital communication
 */
let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;

    if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
        console.warn("⚠️  [EMAIL] SMTP Credentials missing. Email features will be disabled.");
        return null;
    }

    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use STARTTLS
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: true,
            minVersion: 'TLSv1.2'
        },
        family: 4, // Force IPv4 to avoid ENETUNREACH with IPv6
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 15000
    });

    return transporter;
};

export const verifySMTP = async () => {
    const transport = getTransporter();
    if (!transport) return false;

    try {
        await transport.verify();
        console.log("✅ [EMAIL] SMTP Link established successfully.");
        return true;
    } catch (error) {
        console.error("❌ [EMAIL ERROR] SMTP Verification Failed:", error.message);
        return false;
    }
};

export const sendEmail = async (to, subject, text, html, attachments = []) => {
    console.log(`[EMAIL] 🚀 Sending transmission to ${to}...`);
    const transport = getTransporter();

    if (!transport) {
        console.error(`[EMAIL ERROR] ❌ Cannot send email to ${to}: SMTP not configured.`);
        return null;
    }

    try {
        const info = await transport.sendMail({
            from: `"AgroMart 🌾" <${process.env.EMAIL}>`,
            to,
            subject,
            text,
            html,
            attachments
        });
        console.log(`[EMAIL] ✅ Message sent successfully: %s`, info.messageId);
        return info;
    } catch (error) {
        console.error(`[EMAIL ERROR] ❌ Failed to send email to ${to}:`, error.message);
        if (error.code === 'EAUTH') {
            console.error("👉 TIP: Check if your Gmail App Password is correct and EMAIL matches.");
        }
        return null;
    }
};

/**
 * MASTER_WRAPPER: Premium Design System for AgroMart Emails
 */
const MASTER_WRAPPER = (title, content, subtext = "") => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { font-family: 'Inter', -apple-system, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 60px 40px; text-align: center; color: white; }
            .content { padding: 48px 40px; color: #1e293b; line-height: 1.6; }
            .footer { background-color: #f8fafc; padding: 32px 40px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; }
            .btn { display: inline-block; background-color: #059669; color: #ffffff !important; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; margin-top: 24px; transition: all 0.2s; }
            .status-badge { display: inline-block; padding: 6px 16px; border-radius: 99px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
            .badge-success { background-color: #d1fae5; color: #065f46; }
            h1, h2, h3 { color: #0f172a; margin-top: 0; font-weight: 800; letter-spacing: -0.02em; }
            p { margin-bottom: 24px; font-size: 16px; color: #475569; }
            .divider { height: 1px; background-color: #e2e8f0; margin: 32px 0; }
            @media (max-width: 600px) { .container { margin: 0; border-radius: 0; } }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div style="font-size: 42px; margin-bottom: 8px;">🌾</div>
                <div style="font-size: 32px; font-weight: 800; letter-spacing: -1px; margin-bottom: 4px;">AgroMart</div>
                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700; opacity: 0.85;">${title}</div>
            </div>
            <div class="content">
                ${content}
                <div class="divider"></div>
                <p style="font-size: 14px; text-align: center; margin: 0; color: #94a3b8;">
                    ${subtext || "Need immediate assistance? Access our executive support node via the dashboard."}
                </p>
            </div>
            <div class="footer">
                <div style="margin-bottom: 16px; font-weight: 700; color: #334155; font-size: 14px;">AgroMart ERP • Decentralized Agriculture Infrastructure</div>
                <div style="line-height: 2;">
                    DA-IICT Research Park Node • Gandhinagar, India<br/>
                    Managed by Elite Agriculture Operations Group
                </div>
                <div style="margin-top: 20px; opacity: 0.6; font-size: 11px;">
                    This is an encrypted automated transmission. Please do not reply directly to this node.
                </div>
            </div>
        </div>
    </body>
    </html>
`;

export const getWelcomeTemplate = (name) => {
    const content = `
        <h2>Welcome to the Network, ${name}!</h2>
        <p>Your node has been successfully activated within the AgroMart ecosystem. You now have full access to our executive sourcing tools, mandi intelligence, and financial ledgers.</p>
        <p>We've prepared your environment for maximum efficiency. Start by exploring the live mandi rates or configuring your supplier profiles.</p>
        <div style="text-align: center;">
            <a href="https://agromart-erp.vercel.app/dashboard" class="btn">Initialize Your Dashboard</a>
        </div>
    `;
    return MASTER_WRAPPER("Onboarding Activation", content, "Pro Tip: Complete your profile to unlock high-limit credit lines.");
};

export const getOrderConfirmationTemplate = (order, customerName) => {
    const itemsHtml = (order.OrderItems || []).map(item => `
        <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid #f1f5f9;">
                <div style="font-weight: 700; color: #0f172a;">${item.Product ? item.Product.name : 'Unknown Product'}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Rate: ₹${item.price.toFixed(2)}</div>
            </td>
            <td style="padding: 16px 0; border-bottom: 1px solid #f1f5f9; text-align: center; color: #475569;">x${item.quantity}</td>
            <td style="padding: 16px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; color: #0f172a;">₹${item.total.toFixed(2)}</td>
        </tr>
    `).join("");

    const content = `
        <h2>Sourcing Order Confirmed</h2>
        <p>Hello ${customerName}, your request <strong>#${order.id}</strong> has been verified. We are syncing with our warehouse nodes to synchronize your shipment.</p>
        
        <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin-bottom: 32px; border: 1px solid #e2e8f0;">
            <table width="100%">
                <tr>
                    <td style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Reference ID</td>
                    <td align="right" style="font-weight: 800; color: #0f172a;">#${order.id}</td>
                </tr>
                <tr>
                    <td style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; padding-top: 8px;">Lifecycle Status</td>
                    <td align="right" style="padding-top: 8px;"><span class="status-badge badge-success">Confirmed</span></td>
                </tr>
            </table>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: left; padding-bottom: 12px; border-bottom: 2px solid #0f172a; font-size: 12px; color: #0f172a; text-transform: uppercase;">Manifest</th>
                    <th style="text-align: center; padding-bottom: 12px; border-bottom: 2px solid #0f172a; font-size: 12px; color: #0f172a; text-transform: uppercase;">Qty</th>
                    <th style="text-align: right; padding-bottom: 12px; border-bottom: 2px solid #0f172a; font-size: 12px; color: #0f172a; text-transform: uppercase;">Value</th>
                </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
        </table>

        <div style="margin-top: 32px; padding: 24px; background: linear-gradient(to right, #ffffff, #f8fafc); border-radius: 16px; border: 1px solid #e2e8f0; text-align: right;">
            <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Subtotal: ₹${order.total_amount.toFixed(2)}</div>
            <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">Taxes & Fees: ₹${(order.gst_total || 0).toFixed(2)}</div>
            <div style="font-size: 24px; font-weight: 800; color: #059669;">Total: ₹${order.final_amount.toFixed(2)}</div>
        </div>
    `;
    return MASTER_WRAPPER("Order Lifecycle Confirmation", content, "Track your real-time logistics units in the transit dashboard.");
};

export const getOTPTemplate = (otp, name) => {
    const content = `
        <h2>Identity Authentication</h2>
        <p>Hello ${name}, use the secure authorization code below to verify your session and access the AgroMart network.</p>
        <div style="background-color: #f8fafc; padding: 48px 24px; border-radius: 20px; text-align: center; border: 2px solid #e2e8f0; margin: 32px 0;">
            <div style="font-size: 56px; font-weight: 800; letter-spacing: 12px; color: #059669; font-family: monospace;">${otp}</div>
            <div style="margin-top: 24px; font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Expires in 10 minutes</div>
        </div>
        <p style="font-size: 14px; color: #64748b;">If you didn't request this code, your account security might be compromised. Please contact support immediately.</p>
    `;
    return MASTER_WRAPPER("Secure Access Verification", content, "Security Note: Our executive staff will never ask for this code.");
};

export const getRecoveryTemplate = (otp, name) => {
    const content = `
        <h2>Security Recovery Initiated</h2>
        <p>Hello ${name}, we received a request to bypass your current credentials. Use the recovery code as a one-time key to set your new password.</p>
        <div style="background-color: #fff1f2; padding: 48px 24px; border-radius: 20px; text-align: center; border: 2px solid #fecdd3; margin: 32px 0;">
            <div style="font-size: 56px; font-weight: 800; letter-spacing: 12px; color: #e11d48; font-family: monospace;">${otp}</div>
            <div style="margin-top: 24px; font-size: 13px; font-weight: 700; color: #f43f5e; text-transform: uppercase; letter-spacing: 0.1em;">Valid for 10 minutes only</div>
        </div>
    `;
    return MASTER_WRAPPER("Account Security Recovery", content, "If you did not request this, secure your node immediately by resetting your password.");
};

export const getOrderReceiptTemplate = (order, name, amount, mode) => {
    const content = `
        <h2>Payment Processed ✅</h2>
        <p>Success! Your financial transaction has been verified and settled in the AgroMart ledger.</p>
        
        <div style="background-color: #f8fafc; padding: 40px; border-radius: 20px; text-align: center; margin: 32px 0; border: 1px solid #e2e8f0;">
            <div style="font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Settlement Amount</div>
            <div style="font-size: 48px; font-weight: 800; color: #0f172a;">₹${Number(amount).toFixed(2)}</div>
            <div style="margin-top: 16px;"><span class="status-badge badge-success">Received via ${mode}</span></div>
        </div>

        <div style="line-height: 2; font-size: 15px;">
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Order Node:</span>
                <span style="font-weight: 700; color: #0f172a;">#${order.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Settlement Date:</span>
                <span style="font-weight: 700; color: #0f172a;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
        </div>
    `;
    return MASTER_WRAPPER("Digital Financial Receipt", content, "This receipt is a valid tax document for your internal auditing.");
};

export const getInvoiceSettledTemplate = (order, name) => {
    const content = `
        <h2>Ledger Fully Settled</h2>
        <p>Success! Your order <strong>#${order.id}</strong> is now fully paid and settled. Your official digital invoice is attached for your records.</p>
        <div style="background: linear-gradient(135deg, #059669 0%, #065f46 100%); padding: 32px; border-radius: 20px; text-align: center; color: white; margin: 32px 0;">
            <div style="font-size: 13px; font-weight: 700; opacity: 0.9; margin-bottom: 8px; text-transform: uppercase;">Final Settlement Value</div>
            <div style="font-size: 42px; font-weight: 800;">₹${Number(order.final_amount).toFixed(2)}</div>
        </div>
        <div style="text-align: center;">
            <a href="https://agromart-erp.vercel.app/orders" class="btn">Archive & Review Invoices</a>
        </div>
    `;
    return MASTER_WRAPPER("Official Tax Invoice Settled", content, "This settlement triggers final clearance for delivery if pending.");
};

export const getPaymentReminderTemplate = (order, name, balance) => {
    const content = `
        <h2>Financial Action Required</h2>
        <p>Hello ${name}, our audit shows an outstanding balance for order <strong>#${order.id}</strong>. Please settle the amount below to ensure uninterrupted service.</p>
        <div style="background-color: #fff7ed; padding: 40px; border-radius: 20px; margin: 32px 0; border: 2px solid #ffedd5; text-align: center;">
            <div style="font-size: 13px; font-weight: 700; color: #9a3412; text-transform: uppercase; margin-bottom: 8px;">Pending Balance</div>
            <div style="font-size: 48px; font-weight: 800; color: #ea580c;">₹${Number(balance).toFixed(2)}</div>
            <div style="margin-top: 16px; font-size: 14px; font-weight: 700; color: #9a3412;">Reference Order: #${order.id}</div>
        </div>
        <div style="text-align: center;">
            <a href="https://agromart-erp.vercel.app/orders/${order.id}" class="btn" style="background-color: #ea580c;">Settle Balance Now</a>
        </div>
    `;
    return MASTER_WRAPPER("Immediate Payment Alert", content, "Late settlement may affect your credit rating within the AgroMart ecosystem.");
};

export const getNotificationTemplate = (title, message) => {
    const content = `
        <h2>${title}</h2>
        <p style="font-size: 18px; color: #1e293b; margin-bottom: 32px;">${message}</p>
        <div style="text-align: center;">
            <a href="https://agromart-erp.vercel.app/dashboard" class="btn">View Details in Dashboard</a>
        </div>
    `;
    return MASTER_WRAPPER("System Notification", content);
};
