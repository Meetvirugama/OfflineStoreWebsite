import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// ✅ FIX: Returns a Promise that resolves when PDF is fully written
export const generateInvoicePDF = (order, items, customer) => {
  return new Promise((resolve, reject) => {
    const dir = path.join(process.cwd(), "storage", "invoices");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `invoice-${order.id}.pdf`);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // ======================================
    // 🎨 STYLING & BRANDING
    // ======================================
    const themeColor = "#1b5e20"; // Dark Agro Green
    const accentColor = "#4caf50"; // Light Agro Green
    const darkGray = "#222222";
    const medGray = "#555555";
    const lightGray = "#f4f6f5";
    const borderColor = "#eeeeee";

    // WATERMARK
    doc.save();
    doc.rotate(-45, { origin: [300, 400] });
    doc.fontSize(80).fillColor("#000000").fillOpacity(0.03).text("AGROMART", 100, 400);
    doc.restore();

    // ======================================
    // HEADER BLOCK
    // ======================================
    // Top Colored Bar
    doc.rect(0, 0, 600, 10).fill(themeColor);

    // BRAND
    doc.fillColor(themeColor).fontSize(32).font("Helvetica-Bold").text("AgroMart", 40, 40);
    doc.fillColor(accentColor).fontSize(10).font("Helvetica-Bold").text("PREMIUM AGRICULTURAL HUB", 42, 75);

    // COMPANY INFO (Right Aligned)
    doc.fillColor(medGray).fontSize(10).font("Helvetica")
       .text("AgroMart Pvt Ltd.", 250, 45, { align: "right", width: 300 })
       .text("123 Farming Avenue, Green City, IN", 250, 60, { align: "right", width: 300 })
       .text("info@agromart.com | +91 98765 43210", 250, 75, { align: "right", width: 300 })
       .text("GSTIN: 22AAAAA0000A1Z5", 250, 90, { align: "right", width: 300 });

    doc.moveTo(40, 120).lineTo(555, 120).lineWidth(1).strokeColor(borderColor).stroke();

    // ======================================
    // INVOICE META & BILL TO
    // ======================================
    doc.moveDown(1.5);

    // Left Box (Bill To)
    doc.fillColor(medGray).fontSize(10).font("Helvetica-Bold").text("BILL TO:", 40, 140);
    doc.fillColor(darkGray).fontSize(14).font("Helvetica-Bold").text(customer?.name || "Cash Customer", 40, 155, { width: 250, height: 16, ellipsis: true, lineBreak: false });
    doc.fontSize(10).font("Helvetica").fillColor(medGray)
       .text(`Mobile: ${customer?.mobile || "-"}`, 40, 175);
    if (customer?.gst) {
      doc.text(`GSTIN/UIN: ${customer.gst}`, 40, 190);
    }

    // Right Box (Invoice Details)
    doc.fillColor(themeColor).fontSize(20).font("Helvetica-Bold").text("TAX INVOICE", 250, 140, { align: "right", width: 300 });

    doc.fillColor(medGray).fontSize(10).font("Helvetica-Bold").text("Invoice Number:", 340, 170, { width: 100, align: "right" })
       .font("Helvetica").fillColor(darkGray).text(order.invoice_number || "Draft", 450, 170, { align: "right", width: 100 });

    doc.fillColor(medGray).font("Helvetica-Bold").text("Issue Date:", 340, 185, { width: 100, align: "right" })
       .font("Helvetica").fillColor(darkGray).text(new Date(order.order_date || Date.now()).toLocaleDateString(), 450, 185, { align: "right", width: 100 });

    doc.fillColor(medGray).font("Helvetica-Bold").text("Due Date:", 340, 200, { width: 100, align: "right" })
       .font("Helvetica").fillColor(darkGray).text(order.due_date ? new Date(order.due_date).toLocaleDateString() : "Immediate", 450, 200, { align: "right", width: 100 });

    // ======================================
    // TABLE: HEADER
    // ======================================
    let yPos = 250;

    // Table Header Background
    doc.rect(40, yPos, 515, 30).fill(themeColor);
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10);

    doc.text("#", 50, yPos + 10);
    doc.text("ITEM DESCRIPTION", 80, yPos + 10);
    doc.text("QTY", 330, yPos + 10, { width: 40, align: "center" });
    doc.text("PRICE", 380, yPos + 10, { width: 70, align: "right" });
    doc.text("TOTAL", 460, yPos + 10, { width: 85, align: "right" });

    yPos += 30;

    // ======================================
    // TABLE: ROWS
    // ======================================
    doc.font("Helvetica").fontSize(10).fillColor(darkGray);

    items.forEach((item, index) => {
      // Row Background
      if (index % 2 !== 0) doc.rect(40, yPos, 515, 30).fill(lightGray);
      doc.fillColor(darkGray);

      const productName = item.Product?.name || `Product #${item.product_id}`;

      doc.text(String(index + 1), 50, yPos + 10);
      doc.text(productName, 80, yPos + 10, { width: 240, height: 14, ellipsis: true, lineBreak: false });
      doc.text(String(item.quantity), 330, yPos + 10, { width: 40, align: "center" });
      doc.text(`Rs. ${Number(item.price || 0).toFixed(2)}`, 380, yPos + 10, { width: 70, align: "right", ellipsis: true });
      doc.text(`Rs. ${Number(item.total || 0).toFixed(2)}`, 460, yPos + 10, { width: 85, align: "right", ellipsis: true });

      doc.moveTo(40, yPos + 30).lineTo(555, yPos + 30).lineWidth(0.5).strokeColor(borderColor).stroke();

      yPos += 30;
    });

    // ======================================
    // SUMMARY / TOTALS (Bottom Right)
    // ======================================
    yPos += 20;

    // Optional: Left side "Payment Status" or Notes
    doc.fillColor(accentColor).fontSize(14).font("Helvetica-Bold").text("STATUS: " + (order.status || "PAID"), 40, yPos);
    doc.fillColor(medGray).fontSize(9).font("Helvetica").text("All amounts are in Indian Rupees (INR)", 40, yPos + 20);

    // Right side Totals Box
    const printSummaryRow = (label, value, isHighlight = false, isLast = false) => {
      doc.fillColor(medGray).font(isHighlight ? "Helvetica-Bold" : "Helvetica").fontSize(10);
      doc.text(label, 320, yPos, { width: 130, align: "right" });
      doc.fillColor(darkGray).font(isHighlight ? "Helvetica-Bold" : "Helvetica");
      doc.text(value, 460, yPos, { width: 85, align: "right", ellipsis: true });
      yPos += isLast ? 0 : 22;
    };

    printSummaryRow("Subtotal:", `Rs. ${Number(order.total_amount || 0).toFixed(2)}`);
    if (Number(order.discount) > 0) printSummaryRow("Discount:", `- Rs. ${Number(order.discount).toFixed(2)}`);
    if (Number(order.cgst) > 0) printSummaryRow("CGST:", `Rs. ${Number(order.cgst).toFixed(2)}`);
    if (Number(order.sgst) > 0) printSummaryRow("SGST:", `Rs. ${Number(order.sgst).toFixed(2)}`);
    if (Number(order.igst) > 0) printSummaryRow("IGST:", `Rs. ${Number(order.igst).toFixed(2)}`);

    // 🔥 NEW: PAYMENT STATUS ROWS
    const paid = Number(order.paid_amount || 0);
    const balance = Math.max(0, Number(order.final_amount) - paid);
    
    printSummaryRow("Amount Paid:", `Rs. ${paid.toFixed(2)}`, false);
    printSummaryRow("Balance Due:", `Rs. ${balance.toFixed(2)}`, balance > 0);

    // Grand Total Background Box
    doc.rect(340, yPos - 5, 215, 30).fill(themeColor);
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(12);
    doc.text("GRAND TOTAL", 350, yPos + 4, { width: 100, align: "right" });
    doc.text(`Rs. ${Number(order.final_amount || 0).toFixed(2)}`, 460, yPos + 4, { width: 85, align: "right", ellipsis: true });

    // 🔥 ADD 'UNPAID' STAMP IF BALANCE DUE
    if (balance > 0) {
      doc.save();
      doc.fontSize(60).fillColor("#e11d48").fillOpacity(0.12)
         .font("Helvetica-Bold")
         .text("UNPAID / PENDING", 50, 600, { align: "center", width: 500 });
      doc.restore();
    }

    // ======================================
    // FOOTER (Absolute Bottom)
    // ======================================
    doc.moveTo(40, 780).lineTo(555, 780).lineWidth(1).strokeColor(themeColor).stroke();
    doc.font("Helvetica").fontSize(9).fillColor(medGray)
       .text("Thank you for your business. For any discrepancies, contact us within 7 days.", 0, 792, { align: "center", width: 595 });

    doc.end();

    // ✅ Wait for stream to finish before resolving
    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
};