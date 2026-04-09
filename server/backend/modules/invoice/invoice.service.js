import PDFDocument from "pdfkit";

/**
 * PDF Generation Service for Digital Invoices
 */
export const generateInvoicePDF = async (order, res) => {
    const doc = new PDFDocument({ margin: 50 });

    // Stream the PDF directly to the response
    doc.pipe(res);

    // --- Header ---
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("AgroMart ERP", 50, 50)
        .fontSize(10)
        .text("Digital Sourcing Network", 50, 80)
        .text("GSTIN: 24AAACA0000A1Z5", 50, 95)
        .moveDown();

    // --- Invoice Info ---
    doc
        .fillColor("#000000")
        .fontSize(16)
        .text("OFFICIAL INVOICE", 400, 50)
        .fontSize(10)
        .text(`Invoice No: ${order.invoice_number || `INV-${order.id}`}`, 400, 75)
        .text(`Date: ${new Date(order.order_date).toLocaleDateString()}`, 400, 90)
        .text(`Order ID: #${order.id}`, 400, 105)
        .moveDown();

    // --- Customer Info ---
    const customer = order.Customer;
    doc
        .fontSize(12)
        .text("Bill To:", 50, 150)
        .fontSize(10)
        .text(customer?.User?.name || "Verified Customer", 50, 170)
        .text(`Phone: ${customer?.User?.mobile}`, 50, 185)
        .text(`Location: ${customer?.village || "Agro Node"}`, 50, 200)
        .moveDown();

    // --- Table Header ---
    const tableTop = 270;
    doc
        .fontSize(10)
        .text("Product Name", 50, tableTop, { bold: true })
        .text("Unit Price", 280, tableTop, { width: 90, align: "right" })
        .text("Qty", 370, tableTop, { width: 50, align: "right" })
        .text("Total", 480, tableTop, { width: 80, align: "right" });

    doc.moveTo(50, tableTop + 15).lineTo(560, tableTop + 15).strokeColor("#eeeeee").stroke();

    // --- Table Rows ---
    let i = 0;
    for (const item of order.OrderItems) {
        const y = tableTop + 30 + (i * 25);
        doc
            .text(item.Product.name, 50, y)
            .text(`₹${item.price.toFixed(2)}`, 280, y, { width: 90, align: "right" })
            .text(item.quantity.toString(), 370, y, { width: 50, align: "right" })
            .text(`₹${item.total.toFixed(2)}`, 480, y, { width: 80, align: "right" });
        i++;
    }

    // --- Totals ---
    const footerTop = tableTop + 50 + (i * 25);
    doc.moveTo(50, footerTop).lineTo(560, footerTop).strokeColor("#eeeeee").stroke();

    doc
        .fontSize(10)
        .text("Subtotal:", 380, footerTop + 20)
        .text(`₹${order.total_amount.toFixed(2)}`, 480, footerTop + 20, { align: "right" })
        .text("Grand Total:", 380, footerTop + 40, { bold: true })
        .text(`₹${order.final_amount.toFixed(2)}`, 480, footerTop + 40, { align: "right", bold: true });

    // --- Footer ---
    doc
        .fontSize(10)
        .fillColor("#64748b")
        .text("Thank you for sourcing with AgroMart. This is a computer-generated document.", 50, 750, { align: "center" });

    doc.end();
};
