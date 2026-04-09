import Payment from "./payment.model.js";
import Order from "../order/order.model.js";

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
