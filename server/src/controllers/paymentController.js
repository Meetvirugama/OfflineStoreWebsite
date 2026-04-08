import getRazorpay from "../config/razorpay.js";
import crypto from "crypto";
import { RAZORPAY_SECRET } from "../config/env.js";
import { processPaymentService } from "../services/paymentService.js";
import { Payment } from "../models/index.js";

// =====================
// CREATE RAZORPAY ORDER
// =====================
export const createRazorpayOrder = async (req, res) => {
  try {
    const razorpay = getRazorpay();
    const { order_id, amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required"
      });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `order_${order_id}`
    };

    const rzpOrder = await razorpay.orders.create(options);

    res.json({ success: true, data: rzpOrder });

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================
// VERIFY PAYMENT (RAZORPAY)
// =====================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      amount
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    // ✅ SAFE USER (FIX)
    const userId = req.user?.id || 1;

    const result = await processPaymentService({
      order_id,
      amount,
      payment_mode: "UPI",
      created_by: userId
    });

    res.json({
      success: true,
      message: "Payment successful",
      data: result
    });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// =====================
// MANUAL PAYMENT
// =====================
export const addPayment = async (req, res) => {
  try {
    const { order_id, amount, payment_mode } = req.body;

    const result = await processPaymentService({
      order_id,
      amount,
      payment_mode,
      created_by: req.user.id
    });

    res.json({
      success: true,
      message: "Payment added",
      data: result
    });

  } catch (err) {
    console.error("Manual Payment Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================
// PAYMENT HISTORY
// =====================
export const getPaymentsByOrder = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { order_id: req.params.orderId }
    });

    res.json({ success: true, data: payments });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};