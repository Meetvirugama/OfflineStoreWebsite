import { verifySMTP, sendEmail, getOTPTemplate, getWelcomeTemplate, getOrderConfirmationTemplate } from "../utils/email.js";
import { ENV } from "../config/env.js";

/**
 * EMAIL DIAGNOSTIC TOOL
 * Run this to verify your SMTP configuration and Design System rendering.
 * Usage: node server/backend/scripts/test_email.js <your-email>
 */

const targetEmail = process.argv[2];

if (!targetEmail) {
    console.error("❌ Error: Please provide a recipient email address.");
    console.log("Usage: node server/backend/scripts/test_email.js example@gmail.com");
    process.exit(1);
}

const runDiagnostics = async () => {
    console.log("🚀 Starting AgroPlatform Email Diagnostics...");
    console.log(`📡 SMTP User: ${process.env.EMAIL}`);
    console.log(`🌐 Frontend URL: ${ENV.FRONTEND_URL}`);

    // 1. Verify SMTP Connection
    const isConnected = await verifySMTP();
    if (!isConnected) {
        console.error("❌ SMTP Connection Failed. Diagnostics aborted.");
        return;
    }

    // 2. Send Design System Test (OTP Template)
    console.log("\n📦 Diagnostic 1: Design System & OTP Template...");
    const otp = "888999";
    const otpHtml = getOTPTemplate(otp, "Diagnostic User");
    const otpInfo = await sendEmail(
        targetEmail, 
        "AgroPlatform Diagnostic: Design System Test 🌾", 
        `Your diagnostic code is ${otp}`, 
        otpHtml
    );

    if (otpInfo) {
        console.log("✅ Diagnostic 1 Sent.");
    }

    // 3. Send Order Confirmation Simulation
    console.log("\n📦 Diagnostic 2: Data Mapping & Order Template...");
    const mockOrder = {
        id: "DIAG-101",
        total_amount: 1500,
        gst_total: 270,
        final_amount: 1770,
        paid_amount: 0,
        OrderItems: [
            { Product: { name: "N-P-K Fertilizer" }, quantity: 2, price: 500, total: 1000 },
            { Product: { name: "Hybrid Wheat Seeds" }, quantity: 1, price: 500, total: 500 }
        ]
    };
    const orderHtml = getOrderConfirmationTemplate(mockOrder, "Diagnostic User");
    const orderInfo = await sendEmail(
        targetEmail,
        "AgroPlatform Diagnostic: Order System Test 📦",
        "Simulator: Order confirmed.",
        orderHtml
    );

    if (orderInfo) {
        console.log("✅ Diagnostic 2 Sent.");
    }

    console.log("\n🏁 Diagnostics Complete. Please check your inbox (and spam folder).");
};

runDiagnostics();
