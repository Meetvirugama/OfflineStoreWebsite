import path from "path";
import fs from "fs";
import { Payment, Orders, OrderItem, Customer, Product } from "../models/index.js";
import { addLedgerEntry } from "./ledgerService.js";
import { updateCustomerFinancials } from "./customerService.js";
import { generateInvoicePDF } from "./invoiceService.js";
import { sendInvoiceEmail } from "./emailService.js";
import { paymentEvent, invoiceEvent } from "./notificationService.js";

// =====================
// CORE PAYMENT LOGIC
// =====================
export const processPaymentService = async ({
  order_id,
  amount,
  payment_mode,
  created_by
}) => {

  const order = await Orders.findByPk(order_id);
  if (!order) throw new Error("Order not found");

  // 🔍 2. CALCULATE PAID
  const payments = await Payment.findAll({ where: { order_id } });

  const paid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  if (paid >= order.final_amount) {
    throw new Error("Order already fully paid");
  }

  const pendingBefore = Math.max(0, Math.round((order.final_amount - paid) * 100) / 100);

  if (amount > pendingBefore + 0.01) { // small buffer for precision
    throw new Error(`Payment ₹${amount} exceeds pending amount ₹${pendingBefore}`);
  }

  // 💾 3. SAVE PAYMENT
  await Payment.create({
    order_id,
    amount,
    payment_mode,
    created_by
  });

  const newPaid = Math.round((paid + amount) * 100) / 100;
  const pending = Math.max(0, Math.round((order.final_amount - newPaid) * 100) / 100);

  // 📊 4. STATUS
  let status = "PENDING";
  if (pending <= 0) status = "PAID";
  else if (newPaid > 0) status = "PARTIAL";

  // ✅ Update both status AND paid_amount on the order
  await order.update({ status, paid_amount: newPaid });

  // 📘 5. LEDGER
  await addLedgerEntry({
    customer_id: order.customer_id,
    type: "CREDIT",
    amount,
    reference_type: "PAYMENT",
    reference_id: order_id,
    description: "Payment received"
  });

  // 💰 6. CUSTOMER FINANCIALS
  await updateCustomerFinancials(order.customer_id, amount, "CREDIT");

  // 🔔 6.5 PAYMENT NOTIFICATION
  paymentEvent(order_id, order.customer_id, amount, status).catch(err => {
    console.error("Failed to send payment notification:", err.message);
  });

  // 🧾 7. INVOICE + EMAIL (ONLY FULL PAYMENT)
  let invoicePath = null;
  let invoice_number = order.invoice_number;

  if (status === "PAID") {
    // ✅ FIX: Include Product model so invoice has product names
    const items = await OrderItem.findAll({
      where: { order_id },
      include: [{ model: Product, attributes: ["id", "name", "selling_price"] }]
    });

    const customer = await Customer.findByPk(order.customer_id);

    // ✅ FIX: Ensure invoice_number is set before generating PDF
    if (!order.invoice_number) {
      invoice_number = `INV-${new Date().getFullYear()}-${String(order.id).padStart(5, "0")}`;
      await order.update({ invoice_number });
    }

    try {
      // 🔥 FORCE: Delete existing file before generating (Ensures PAID status reflects)
      const dir = path.join(process.cwd(), "storage", "invoices");
      const oldFile = path.join(dir, `invoice-${order_id}.pdf`);
      if (fs.existsSync(oldFile)) {
        try { fs.unlinkSync(oldFile); } catch (e) {
          console.warn("Could not delete old invoice file:", e.message);
        }
      }

      // ✅ Generate fresh PDF (internal cache removed in service)
      invoicePath = await generateInvoicePDF(order, items, customer);

      // Send email (non-blocking – don't crash if email fails)
      sendInvoiceEmail(customer, invoicePath, order).catch(err => {
        console.error("Invoice email failed (non-fatal):", err.message);
      });

      // 🔔 TRIGGER INVOICE NOTIFICATION
      invoiceEvent(order_id, order.customer_id, invoice_number).catch(err => {
        console.error("Invoice notification failed:", err.message);
      });
    } catch (err) {
      console.error("Invoice PDF generation failed (non-fatal):", err.message);
    }
  }

  return {
    paid: newPaid,
    pending,
    status,
    invoice_number,
    invoicePath
  };
};