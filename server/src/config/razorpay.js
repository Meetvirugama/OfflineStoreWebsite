import Razorpay from "razorpay";

import { RAZORPAY_KEY, RAZORPAY_SECRET } from "./env.js";

let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    if (!RAZORPAY_KEY) {
      throw new Error("RAZORPAY_KEY is missing in env.js. Ensure it is defined in .env.");
    }
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY,
      key_secret: RAZORPAY_SECRET
    });
  }
  return razorpayInstance;
};

export default getRazorpay;
