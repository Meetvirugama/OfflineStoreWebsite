
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as emailTemplates from '../server/backend/utils/email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const previewDir = path.join(__dirname, 'previews');

if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir);
}

const mockOrder = {
    id: 'OR-7742-X',
    total_amount: 15400.00,
    gst_total: 2772.00,
    final_amount: 18172.00,
    OrderItems: [
        { Product: { name: 'High-Yield Wheat Seeds' }, price: 4500.00, quantity: 2, total: 9000.00 },
        { Product: { name: 'Organic N-P-K Fertilizer' }, price: 3200.00, quantity: 2, total: 6400.00 }
    ]
};

const templates = {
    'welcome.html': emailTemplates.getWelcomeTemplate('Farmer John'),
    'otp.html': emailTemplates.getOTPTemplate('882941', 'Aditi Sharma'),
    'order_confirmation.html': emailTemplates.getOrderConfirmationTemplate(mockOrder, 'Vikram Singh'),
    'recovery.html': emailTemplates.getRecoveryTemplate('441029', 'Rajesh Kumar'),
    'receipt.html': emailTemplates.getOrderReceiptTemplate(mockOrder, 'Vikram Singh', 18172.00, 'UPI/NetBanking'),
    'invoice_settled.html': emailTemplates.getInvoiceSettledTemplate(mockOrder, 'Vikram Singh'),
    'payment_reminder.html': emailTemplates.getPaymentReminderTemplate(mockOrder, 'Vikram Singh', 5000.00),
    'notification.html': emailTemplates.getNotificationTemplate('Weather Alert: Heavy Rain', 'A significant storm system is approaching your region. Secure your warehouse nodes and adjust harvest schedules.')
};

console.log("Generating template previews...");

for (const [filename, html] of Object.entries(templates)) {
    const filePath = path.join(previewDir, filename);
    fs.writeFileSync(filePath, html);
    console.log(`✅ Generated: ${filename}`);
}

console.log("\nDone! Previews available in scratch/previews/");
