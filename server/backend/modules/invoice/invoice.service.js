import PDFDocument from "pdfkit";

/**
 * PDF Generation Service for Digital Invoices
 */
export const generateInvoicePDF = async (order, res) => {
    const doc = new PDFDocument({ margin: 50 });

    // Stream the PDF directly to the response
    doc.pipe(res);

    const balance = Number(order.final_amount) - Number(order.paid_amount || 0);
    const isPaid = balance <= 0;

    // --- Header ---
    doc
        .fillColor("#059669")
        .fontSize(24)
        .text("AgroMart", 50, 50)
        .fillColor("#444444")
        .fontSize(10)
        .text("Executive Sourcing Node", 50, 80)
        .text("GSTIN: 24AAACA0000A1Z5", 50, 95);

    // --- Status Banner ---
    doc
        .rect(400, 45, 160, 25)
        .fill(isPaid ? "#d1fae5" : "#fee2e2");
    
    doc
        .fillColor(isPaid ? "#059669" : "#b91c1c")
        .fontSize(10)
        .text(isPaid ? "ORDER FULLY PAID" : "PAYMENT OUTSTANDING", 400, 54, { width: 160, align: "center" });

    // --- Invoice Info ---
    doc
        .fillColor("#000000")
        .fontSize(14)
        .text("OFFICIAL INVOICE", 400, 85)
        .fontSize(9)
        .text(`Ref: ${order.invoice_number || `ORD-${order.id}`}`, 400, 105)
        .text(`Date: ${new Date(order.order_date).toLocaleDateString()}`, 400, 120)
        .moveDown();

    // --- Customer Info ---
    const customer = order.Customer;
    doc
        .fontSize(11)
        .text("BILL TO:", 50, 150, { bold: true })
        .fontSize(10)
        .text(customer?.User?.name || "Verified Customer", 50, 170)
        .text(`Phone: ${customer?.User?.mobile}`, 50, 185)
        .text(`Site: ${customer?.village || "Agro Node"}`, 50, 200)
        .moveDown();

    // --- Table Header ---
    const tableTop = 270;
    doc
        .rect(50, tableTop - 10, 510, 25)
        .fill("#f8fafc");

    doc
        .fillColor("#475569")
        .fontSize(9)
        .text("PRODUCT / SERVICE", 60, tableTop)
        .text("UNIT PRICE", 280, tableTop, { width: 90, align: "right" })
        .text("QTY", 370, tableTop, { width: 50, align: "right" })
        .text("TOTAL", 480, tableTop, { width: 80, align: "right" });

    // --- Table Rows ---
    let i = 0;
    doc.fillColor("#000000");
    for (const item of order.OrderItems) {
        const y = tableTop + 30 + (i * 25);
        doc
            .fontSize(9)
            .text(item.Product.name.substring(0, 40), 60, y)
            .text(`₹${item.price.toFixed(2)}`, 280, y, { width: 90, align: "right" })
            .text(item.quantity.toString(), 370, y, { width: 50, align: "right" })
            .text(`₹${item.total.toFixed(2)}`, 480, y, { width: 80, align: "right" });
        i++;
    }

    // --- Financial Summary ---
    const summaryTop = tableTop + 50 + (i * 25);
    doc.rect(350, summaryTop, 210, 100).fill("#f8fafc").stroke("#e2e8f0");
    
    doc.fillColor("#475569").fontSize(9);
    doc.text("Subtotal:", 370, summaryTop + 15).text(`₹${order.total_amount.toFixed(2)}`, 480, summaryTop + 15, { align: "right" });
    doc.text("GST (18%):", 370, summaryTop + 30).text(`₹${Number(order.gst_total || 0).toFixed(2)}`, 480, summaryTop + 30, { align: "right" });
    
    doc.fillColor("#0f172a").fontSize(10).text("Grand Total:", 370, summaryTop + 50, { bold: true });
    doc.text(`₹${order.final_amount.toFixed(2)}`, 480, summaryTop + 50, { align: "right", bold: true });

    doc.fillColor("#059669").fontSize(9).text("Total Paid:", 370, summaryTop + 70);
    doc.text(`₹${Number(order.paid_amount || 0).toFixed(2)}`, 480, summaryTop + 70, { align: "right" });

    doc.fillColor("#b91c1c").fontSize(10).text("Balance Due:", 370, summaryTop + 85, { bold: true });
    doc.text(`₹${balance.toFixed(2)}`, 480, summaryTop + 85, { align: "right", bold: true });

    // --- PAID STAMP ---
    if (isPaid) {
        doc
            .fontSize(30)
            .opacity(0.1)
            .fillColor("#059669")
            .text("SETTLED & PAID", 50, 450, { rotate: 30, align: "center" })
            .opacity(1);
    }

    // --- Footer ---
    doc
        .fontSize(8)
        .fillColor("#94a3b8")
        .text("This document is a computer-generated transaction record for the AgroMart Executive Sourcing Network.", 50, 750, { align: "center" })
        .text("Powered by AgroMart ERP Smart Ledger Technology.", 50, 765, { align: "center" });

    doc.end();
};
