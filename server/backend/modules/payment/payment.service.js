import Razorpay from "razorpay";
import Payment from "./payment.model.js";
import Order from "../order/order.model.js";

const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY, 
    key_secret: process.env.RAZORPAY_SECRET
});

export const createRazorpayOrder = async (orderId, amount) => {
    const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_order_${orderId}`,
    };

    try {
        const rzpOrder = await rzp.orders.create(options);
        return rzpOrder;
    } catch (err) {
        console.error("RAZORPAY ORDER ERROR:", err);
        throw new Error("Failed to create Razorpay Order");
    }
};

export const createPayment = async (orderId, userId, amount, referenceNo, mode = "RAZORPAY") => {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");

    const payment = await Payment.create({
        order_id: orderId,
        created_by: userId,
        amount,
        reference_no: referenceNo,
        payment_mode: mode,
        payment_date: new Date()
    });

    await order.update({ 
        status: "COMPLETED",
        paid_amount: Number(order.paid_amount || 0) + Number(amount)
    });
    
    // 5. Send Professional Receipt Email
    try {
        const { getOrderById } = await import("../order/order.service.js");
        const { User: UserModel } = await import("../user/user.model.js");
        const { sendEmail, getOrderReceiptTemplate } = await import("../../utils/email.js");
        const { notify } = await import("../notification/notification.service.js");

        const fullOrder = await getOrderById(orderId);
        const user = await UserModel.findByPk(userId);

        if (user && user.email) {
            // 1. Send Basic Receipt for this payment
            const { getOrderReceiptTemplate, getInvoiceSettledTemplate } = await import("../../utils/email.js");
            const receiptHtml = getOrderReceiptTemplate(fullOrder, user.name || "Farmer", amount, mode);
            await sendEmail(user.email, `Payment Receipt: Order #${orderId} ✅`, `Payment of ₹${amount} received.`, receiptHtml);

            // 2. If fully paid, send Official Settled Invoice with PDF attachment
            const updatedOrder = await getOrderById(orderId); // Fetch latest for balance check
            const balance = Number(updatedOrder.final_amount) - Number(updatedOrder.paid_amount || 0);
            
            if (balance <= 0) {
                const { generateInvoicePDF } = await import("../invoice/invoice.service.js");
                const pdfBuffer = await generateInvoicePDF(updatedOrder);
                const settledHtml = getInvoiceSettledTemplate(updatedOrder, user.name || "Farmer");
                
                await sendEmail(
                    user.email, 
                    `Official Invoice: Order #${orderId} Settled ✅`, 
                    `Your order is fully paid. Download your invoice.`, 
                    settledHtml,
                    [{
                        filename: `AgroMart_Invoice_${orderId}.pdf`,
                        content: pdfBuffer
                    }]
                );
            }
        }

        await notify(userId, "Payment Received! ✅", `Your payment of ₹${amount.toFixed(2)} was processed successfully.`, "SUCCESS");
    } catch (err) {
        console.error("Post-Payment Workflow Error:", err);
    }

    return payment;
};

export const getHistory = async (userId) => {
    return await Payment.findAll({ where: { created_by: userId } });
};
