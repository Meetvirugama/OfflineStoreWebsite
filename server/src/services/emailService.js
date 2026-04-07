import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getInvoiceEmailTemplate, getOrderConfirmationTemplate } from "../utils/emailTemplates.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Explicitly load .env in case this module is imported before app.js init
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials missing in process.env");
    }
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
};
export const sendEmail = async (to, subject, html) => {
  await getTransporter().sendMail({
    from: `"AgroMart 🌿" <${process.env.EMAIL}>`,
    to,
    subject,
    html
  });
};

// =====================
// INVOICE EMAIL
// =====================
export const sendInvoiceEmail = async (customer, filePath, order) => {
  if (!customer?.email) return;

  await getTransporter().sendMail({
    from: process.env.EMAIL,
    to: customer.email,
    subject: `Your AgroMart Invoice #${order?.invoice_number || order?.id || 'Ready'} 🌿`,
    html: getInvoiceEmailTemplate(customer.name, order?.id, order?.final_amount),
    attachments: [
      {
        filename: `invoice.pdf`,
        path: filePath
      }
    ]
  });
};

// =====================
// ORDER CONFIRMATION
// =====================
export const sendOrderConfirmationEmail = async (customer, order) => {
  if (!customer?.email) return;

  await getTransporter().sendMail({
    from: `"AgroMart 🌿" <${process.env.EMAIL}>`,
    to: customer.email,
    subject: `Order Confirmed: #${order?.id} at AgroMart 🌿`,
    html: getOrderConfirmationTemplate(customer.name, order?.id, order?.final_amount)
  });
};