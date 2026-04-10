import * as invoiceService from "./server/backend/modules/invoice/invoice.service.js";
import fs from "fs";

const mockOrder = {
    id: 1,
    invoice_number: "INV-001",
    order_date: new Date(),
    final_amount: 1180,
    paid_amount: 1000,
    total_amount: 1000,
    gst_total: 180,
    Customer: {
        User: { name: "Test Farmer", mobile: "1234567890" },
        village: "Test Village"
    },
    OrderItems: [
        {
            Product: { name: "Test Product" },
            price: 500,
            quantity: 2,
            total: 1000
        }
    ]
};

async function test() {
    try {
        const buffer = await invoiceService.generateInvoicePDF(mockOrder);
        fs.writeFileSync("test-invoice.pdf", buffer);
        console.log("PDF generated successfully, size:", buffer.length);
    } catch (err) {
        console.error("PDF generation failed:", err);
    }
}

test();
