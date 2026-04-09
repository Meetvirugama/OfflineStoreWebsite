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

    await order.update({ status: "COMPLETED" });
    
    return payment;
};

export const getHistory = async (userId) => {
    return await Payment.findAll({ where: { created_by: userId } });
};
