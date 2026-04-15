import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

/**
 * Global Email Utility for AgroPlatform ERP
 * Uses Standard SMTP with Email and App Password.
 */

let transporter = null;

export const getTransporter = async () => {
    if (transporter) return transporter;

    if (!ENV.EMAIL || !ENV.EMAIL_PASS) {
        console.warn("⚠️  [EMAIL] Email credentials missing. Using mock transporter.");
        return null;
    }

    try {
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: ENV.EMAIL,
                pass: ENV.EMAIL_PASS,
            },
            pool: true, // Use connection pooling for efficiency
            maxConnections: 5,
            maxMessages: 100
        });
        return transporter;
    } catch (err) {
        console.error("❌ [EMAIL] Failed to initialize SMTP transporter:", err.message);
        return null;
    }
};

export const verifySMTP = async () => {
    const transport = await getTransporter();
    if (!transport) return false;

    try {
        await transport.verify();
        console.log("✅ [EMAIL] SMTP Link verified successfully.");
        return true;
    } catch (error) {
        console.error("❌ [EMAIL ERROR] SMTP Verification Failed:", error.message);
        return false;
    }
};

export const sendEmail = async (to, subject, text, html, attachments = []) => {
    console.log(`[EMAIL] 🚀 Sending transmission to ${to}...`);
    const transport = await getTransporter();

    if (!transport) {
        console.error(`[EMAIL ERROR] ❌ Cannot send email to ${to}: Service not configured.`);
        return null;
    }

    try {
        const info = await transport.sendMail({
            from: `"AgroPlatform 🌾" <${ENV.EMAIL}>`,
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
        return null;
    }
};


/**
 * MASTER_WRAPPER: Premium Design System for AgroPlatform Emails
 * Features: High-contrast gradients, modern typography, glassmorphism cards.
 */
const MASTER_WRAPPER = (title, content, subtext = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        body { 
            font-family: 'Inter', -apple-system, sans-serif; 
            background-color: #0c0e12; 
            margin: 0; 
            padding: 0; 
            -webkit-font-smoothing: antialiased; 
            color: #e2e8f0;
        }
        
        .main-container { 
            width: 100%;
            background-color: #0c0e12;
            padding: 40px 0;
        }

        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #1a1d23;
            border-radius: 32px; 
            overflow: hidden; 
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5);
        }

        .header { 
            background: linear-gradient(135deg, #059669 0%, #10b981 100%); 
            padding: 80px 40px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            z-index: 1;
        }

        .header-content {
            position: relative;
            z-index: 2;
        }

        .logo-circle {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin-bottom: 24px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .brand-name {
            font-family: 'Outfit', sans-serif;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: -1px;
            color: white;
            margin-bottom: 8px;
        }

        .tagline {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 4px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.8);
        }

        .content { 
            padding: 60px 50px; 
            background: #1a1d23;
            color: #d1d5db; 
            line-height: 1.8; 
        }

        .footer { 
            background-color: #111418; 
            padding: 40px 50px; 
            text-align: center; 
            font-size: 12px; 
            color: #64748b; 
            border-top: 1px solid rgba(255, 255, 255, 0.03); 
        }

        .btn { 
            display: inline-block; 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: #ffffff !important; 
            padding: 18px 40px; 
            border-radius: 16px; 
            text-decoration: none; 
            font-weight: 700; 
            font-size: 16px; 
            margin-top: 32px; 
            box-shadow: 0 10px 20px -5px rgba(5, 150, 105, 0.3);
        }

        .status-badge { 
            display: inline-block; 
            padding: 6px 16px; 
            border-radius: 99px; 
            font-size: 11px; 
            font-weight: 800; 
            text-transform: uppercase; 
            letter-spacing: 0.1em; 
        }

        .badge-success { 
            background-color: rgba(16, 185, 129, 0.1); 
            color: #34d399; 
            border: 1px solid rgba(52, 211, 153, 0.2);
        }

        h1, h2, h3 { 
            font-family: 'Outfit', sans-serif;
            color: #ffffff; 
            margin-top: 0; 
            font-weight: 700; 
            letter-spacing: -0.02em; 
        }
        
        h2 { font-size: 28px; line-height: 1.2; margin-bottom: 24px; }

        p { margin-bottom: 24px; font-size: 17px; color: #9ca3af; }

        .divider { 
            height: 1px; 
            background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.05), transparent); 
            margin: 40px 0; 
        }

        .card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            padding: 32px;
            margin-bottom: 32px;
        }

        @media (max-width: 640px) { 
            .container { border-radius: 0; }
            .content { padding: 40px 24px; }
            .header { padding: 60px 24px; }
        }
    </style>
</head>
<body>
    <div class="main-container">
        <div class="container">
            <div class="header">
                <div class="header-content">
                    <div class="logo-circle">🌾</div>
                    <div class="brand-name">AgroPlatform</div>
                    <div class="tagline">${title}</div>
                </div>
            </div>
            <div class="content">
                ${content}
                <div class="divider"></div>
                <p style="font-size: 14px; text-align: center; margin: 0; color: #6b7280;">
                    ${subtext || `Need assistance? Access our support portal via the <a href="${ENV.FRONTEND_URL}/dashboard" style="color: #10b981; font-weight: 600; text-decoration: none;">Executive Dashboard</a>.`}
                </p>
            </div>
            <div class="footer">
                <div style="margin-bottom: 16px; font-weight: 700; color: #94a3b8; font-size: 14px; letter-spacing: 0.05em;">AGROPLATFORM ERP • INTELLIGENT AGRICULTURE</div>
                <div style="line-height: 2; color: #4b5563; font-weight: 500;">
                    Global Operations Node • Gandhinagar, India<br/>
                    Managed by Elite Agriculture Operations Group
                </div>
                <div style="margin-top: 24px; opacity: 0.4; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
                    Encrypted Automated Transmission. Confidential.
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const getWelcomeTemplate = (name) => {
    const content = `
        <h2>Welcome to the Grid, ${name}!</h2>
        <p>Your node has been successfully synchronized with the AgroPlatform ecosystem. You now command full access to our executive sourcing tools, mandi intelligence, and real-time financial protocols.</p>
        <div class="card">
            <p style="margin: 0; font-style: italic;">"Empowering the world's most vital industry through decentralized intelligence."</p>
        </div>
        <p>We've initialized your environment for peak performance. Begin your deployment by exploring market trends or configuring your supply nodes.</p>
        <div style="text-align: center;">
            <a href="${ENV.FRONTEND_URL}/dashboard" class="btn">Initialize Interface</a>
        </div>
    `;
    return MASTER_WRAPPER("Onboarding Activation", content, "Priority Access: Complete your profile to unlock high-limit credit lines.");
};

export const getOrderConfirmationTemplate = (order, customerName) => {
    const itemsHtml = (order.OrderItems || []).map(item => `
        <tr>
            <td style="padding: 20px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
                <div style="font-weight: 600; color: #ffffff; font-size: 16px;">${item.Product ? item.Product.name : 'Unknown Product'}</div>
                <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">Unit Value: ₹${item.price.toLocaleString('en-IN')}</div>
            </td>
            <td style="padding: 20px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.03); text-align: center; color: #9ca3af;">x${item.quantity}</td>
            <td style="padding: 20px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.03); text-align: right; font-weight: 700; color: #10b981;">₹${item.total.toLocaleString('en-IN')}</td>
        </tr>
    `).join("");

    const content = `
        <h2>Transaction Authorized</h2>
        <p>Hello ${customerName}, your sourcing requisition <strong>#${order.id}</strong> has been verified. Our logistics nodes are now synchronizing for immediate fulfillment.</p>
        
        <div class="card" style="padding: 24px;">
            <table width="100%">
                <tr>
                    <td style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Node Reference</td>
                    <td align="right" style="font-weight: 700; color: #ffffff;">#${order.id}</td>
                </tr>
                <tr>
                    <td style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; padding-top: 12px;">Deployment Status</td>
                    <td align="right" style="padding-top: 12px;"><span class="status-badge badge-success">Manifested</span></td>
                </tr>
            </table>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: left; padding-bottom: 16px; border-bottom: 1px solid #10b981; font-size: 11px; color: #10b981; text-transform: uppercase; letter-spacing: 0.1em;">Asset Manifest</th>
                    <th style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #10b981; font-size: 11px; color: #10b981; text-transform: uppercase; letter-spacing: 0.1em;">Qty</th>
                    <th style="text-align: right; padding-bottom: 16px; border-bottom: 1px solid #10b981; font-size: 11px; color: #10b981; text-transform: uppercase; letter-spacing: 0.1em;">Value</th>
                </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
        </table>

        <div style="margin-top: 40px; padding: 32px; background: rgba(16, 185, 129, 0.05); border-radius: 24px; border: 1px solid rgba(16, 185, 129, 0.1); text-align: right;">
            <div style="font-size: 14px; color: #64748b; margin-bottom: 6px;">Aggregate Subtotal: ₹${order.total_amount.toLocaleString('en-IN')}</div>
            <div style="font-size: 14px; color: #64748b; margin-bottom: 10px;">Tax Deductions (GST): ₹${(order.gst_total || 0).toLocaleString('en-IN')}</div>
            <div style="font-size: 26px; font-weight: 800; color: #ffffff; font-family: 'Outfit', sans-serif;">Net Exposure: ₹${order.final_amount.toLocaleString('en-IN')}</div>
        </div>
    `;
    return MASTER_WRAPPER("Inventory Requisition Sync", content, "Monitor real-time logistics units in the transit dashboard.");
};

export const getOTPTemplate = (otp, name) => {
    const content = `
        <h2>Authentication Protocol</h2>
        <p>Hello ${name}, an access request was detected. Use the secure authorization cipher below to authenticate your session.</p>
        <div style="background: rgba(255, 255, 255, 0.02); padding: 60px 24px; border-radius: 28px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.05); margin: 40px 0;">
            <div style="font-size: 64px; font-weight: 800; letter-spacing: 16px; color: #10b981; font-family: 'Outfit', monospace; padding-left: 16px;">${otp}</div>
            <div style="margin-top: 32px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.3em;">Valid for 600 Seconds</div>
        </div>
        <div class="card" style="background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.2);">
            <p style="font-size: 14px; color: #f87171; margin: 0; text-align: center; font-weight: 500;">If you did not initiate this sequence, your node may be compromised. Alert security immediately.</p>
        </div>
    `;
    return MASTER_WRAPPER("Identity Verification", content, "Notice: System administrators will never request this cipher.");
};

export const getRecoveryTemplate = (otp, name) => {
    const content = `
        <h2>Credential Recovery</h2>
        <p>Hello ${name}, a request to override your authentication keys has been received. Use the recovery cipher to reset your security configuration.</p>
        <div style="background: rgba(239, 68, 68, 0.02); padding: 60px 24px; border-radius: 28px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.1); margin: 40px 0;">
            <div style="font-size: 64px; font-weight: 800; letter-spacing: 16px; color: #ef4444; font-family: 'Outfit', monospace; padding-left: 16px;">${otp}</div>
            <div style="margin-top: 32px; font-size: 12px; font-weight: 700; color: #ef4444; text-transform: uppercase; letter-spacing: 0.3em;">Temporary Security Key</div>
        </div>
    `;
    return MASTER_WRAPPER("Asset Access Recovery", content, "Action Needed: Reset your credentials immediately upon login.");
};

export const getOrderReceiptTemplate = (order, name, amount, mode) => {
    const content = `
        <h2>Settlement Authorized ✅</h2>
        <p>Your financial transaction has been successfully cleared and recorded in the AgroPlatform ledger.</p>
        
        <div class="card" style="text-align: center; background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);">
            <div style="font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Settled Amount</div>
            <div style="font-size: 52px; font-weight: 800; color: #ffffff; font-family: 'Outfit', sans-serif;">₹${Number(amount).toLocaleString('en-IN')}</div>
            <div style="margin-top: 20px;"><span class="status-badge badge-success">Processed via ${mode}</span></div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.01); border-radius: 20px; padding: 24px; font-size: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #64748b;">Transaction Node:</span>
                <span style="font-weight: 600; color: #ffffff;">#${order.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Ledger Date:</span>
                <span style="font-weight: 600; color: #ffffff;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
        </div>
    `;
    return MASTER_WRAPPER("Financial Settlement Confirmed", content, "This transmission serves as an official tax document.");
};

export const getInvoiceSettledTemplate = (order, name) => {
    const content = `
        <h2>Ledger Reconciliation Complete</h2>
        <p>Excellent progress, ${name}. Order <strong>#${order.id}</strong> has been fully reconciled. Your official digital manifest is attached.</p>
        <div class="card" style="background: linear-gradient(135deg, #059669 0%, #064e3b 100%); text-align: center; border: none;">
            <div style="font-size: 12px; font-weight: 700; color: rgba(255, 255, 255, 0.7); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em;">Final Reconciled Value</div>
            <div style="font-size: 48px; font-weight: 800; color: white; font-family: 'Outfit', sans-serif;">₹${Number(order.final_amount).toLocaleString('en-IN')}</div>
        </div>
        <div style="text-align: center;">
            <a href="${ENV.FRONTEND_URL}/orders" class="btn">Access Archive</a>
        </div>
    `;
    return MASTER_WRAPPER("Official Invoice Settlement", content, "Settlement triggers final logistic clearance.");
};

export const getPaymentReminderTemplate = (order, name, balance) => {
    const content = `
        <h2>Financial Alert</h2>
        <p>Attention ${name}, our audit protocols detected an outstanding balance for requisition <strong>#${order.id}</strong>. Settle the exposure to maintain node integrity.</p>
        <div class="card" style="background: rgba(245, 158, 11, 0.05); border-color: rgba(245, 158, 11, 0.2); text-align: center;">
            <div style="font-size: 12px; font-weight: 700; color: #f59e0b; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.1em;">Unsettled Balance</div>
            <div style="font-size: 52px; font-weight: 800; color: #f59e0b; font-family: 'Outfit', sans-serif;">₹${Number(balance).toLocaleString('en-IN')}</div>
            <div style="margin-top: 16px; font-size: 14px; font-weight: 600; color: #92400e;">Reference: ORDER_NODE_${order.id}</div>
        </div>
        <div style="text-align: center;">
            <a href="${ENV.FRONTEND_URL}/orders/${order.id}" class="btn" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); box-shadow: 0 10px 20px -5px rgba(245, 158, 11, 0.3);">Settle Exposure Now</a>
        </div>
    `;
    return MASTER_WRAPPER("Action Required: Pending Balance", content, "Late settlement may degrade your internal credit rating.");
};

export const getSupportInquiryTemplate = (userName, email, subject, message) => {
    const content = `
        <div style="background: rgba(16, 185, 129, 0.05); border-left: 4px solid #10b981; padding: 24px; border-radius: 4px 16px 16px 4px; margin-bottom: 32px;">
            <p style="margin: 0; color: #10b981; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em;">Communication Subject</p>
            <p style="margin: 8px 0 0; font-size: 20px; font-weight: 700; color: white; line-height: 1.2;">${subject}</p>
        </div>
        <div class="card" style="padding: 24px;">
            <p style="margin-bottom: 8px; font-weight: 600; color: #ffffff;">Source Entity:</p>
            <p style="margin-bottom: 16px;">${userName} (<a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a>)</p>
            <div style="height: 1px; background: rgba(255, 255, 255, 0.05); margin: 24px 0;"></div>
            <p style="margin-bottom: 8px; font-weight: 600; color: #ffffff;">Transmission Content:</p>
            <div style="white-space: pre-wrap; color: #d1d5db; font-size: 16px; line-height: 1.6;">${message}</div>
        </div>
        <div style="text-align: center;">
            <a href="mailto:${email}" class="btn">Deploy Response</a>
        </div>
    `;
    return MASTER_WRAPPER("Executive Support Inquiry", content, "Message originated via the Global Sourcing Node.");
};

export const getNotificationTemplate = (title, message) => {
    const content = `
        <h2>${title}</h2>
        <p style="font-size: 18px; color: #d1d5db; margin-bottom: 36px; line-height: 1.6;">${message}</p>
        <div style="text-align: center;">
            <a href="${ENV.FRONTEND_URL}/dashboard" class="btn">Analyze in Dashboard</a>
        </div>
    `;
    return MASTER_WRAPPER("System Event Notification", content);
};

