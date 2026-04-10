import * as invoiceService from "./invoice.service.js";
import * as orderService from "../order/order.service.js";
import { asyncHandler } from "../../utils/errorHandler.js";

/**
 * Handle Invoice PDF Download
 */
export const downloadInvoice = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    
    const order = await orderService.getOrderById(orderId);
    
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Security: Only Admin or the Order Owner can download invoice
    if (req.user.role !== "ADMIN" && order.created_by !== req.user.id) {
        return res.status(403).json({ success: false, message: "Access denied to this invoice" });
    }

    try {
        // Generate PDF as buffer first
        const pdfBuffer = await invoiceService.generateInvoicePDF(order);

        // Set headers for PDF download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Length", pdfBuffer.length);
        res.setHeader("Content-Disposition", `attachment; filename=invoice-${orderId}.pdf`);

        // Send binary data
        res.end(pdfBuffer);
    } catch (err) {
        console.error("Invoice Download Failed:", err);
        res.status(500).json({ success: false, message: "Critical failure generating invoice document" });
    }
});
