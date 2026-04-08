import Payment from "./payment.model.js";
import Order from "../order/order.model.js";

export const createPayment = async (orderId, userId, amount, transactionId) => {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");

    const payment = await Payment.create({
        order_id: orderId,
        user_id: userId,
        amount,
        transaction_id: transactionId,
        status: "SUCCESS"
    });

    await order.update({ payment_status: "PAID", status: "COMPLETED" });
    
    return payment;
};

export const getHistory = async (userId) => {
    return await Payment.findAll({ where: { user_id: userId } });
};
