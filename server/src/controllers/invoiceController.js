import fs from "fs";
import path from "path";
import { Orders, OrderItem, Product, Customer } from "../models/index.js";
import { generateInvoicePDF } from "../services/invoiceService.js";

export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const dir = path.join(process.cwd(), "storage", "invoices");
    const filePath = path.join(dir, `invoice-${orderId}.pdf`);

    // 1. Fetch Order + Customer (Parallel)
    const order = await Orders.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const customer = await Customer.findByPk(order.customer_id);

    // 2. Determine Professional Filename (Include Customer Name)
    const customerName = (customer?.name || "Customer").replace(/[^a-zA-Z0-9]/g, "_");
    const invoiceNum = order.invoice_number || `INV-${new Date().getFullYear()}-${String(orderId).padStart(5, "0")}`;
    const professionalName = `AgroMart_${customerName}_${invoiceNum.replace(/-/g, "_")}.pdf`;

    // 3. Smart Integrity Check & Regeneration Logic
    let shouldRegenerate = false;

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      // 🔥 REGENERATE: If file is empty OR if the file is older than (or equal to) the order's last update
      // We add a 1000ms (1s) buffer to handle filesystem vs database clock precision jitter
      const fileTime = new Date(stats.mtime).getTime();
      const orderTime = new Date(order.updatedAt).getTime();

      if (stats.size === 0 || fileTime <= orderTime + 1000) {
        shouldRegenerate = true;
        try { fs.unlinkSync(filePath); } catch (e) {} 
      }
    } else {
      shouldRegenerate = true;
    }

    // 4. Serve exists OR generate
    if (!shouldRegenerate) {
      res.setHeader("Content-Type", "application/pdf");
      return res.download(filePath, professionalName);
    }

    // 5. PARALLEL DATA FETCHING (Optimization)
    const [items] = await Promise.all([
      OrderItem.findAll({
        where: { order_id: orderId },
        include: [{ model: Product, attributes: ["id", "name", "selling_price"] }]
      })
    ]);

    // Ensure invoice number is saved if generated now
    if (!order.invoice_number) {
      await order.update({ invoice_number: invoiceNum });
    }

    // 6. Generate and send with professional name
    const newPath = await generateInvoicePDF(order, items, customer);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.download(newPath, professionalName);

  } catch (err) {
    console.error("Invoice Download Error:", err);
    res.status(500).json({ message: "Could not generate or download invoice" });
  }
};