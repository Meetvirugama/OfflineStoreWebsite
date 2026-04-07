import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import { sendEmail } from "./emailService.js";
import { getOtpEmailTemplate } from "../utils/emailTemplates.js";
import { JWT_SECRET } from "../config/env.js";

// ===============================
// ✅ REGISTER
// ===============================
export const registerService = async (data) => {
  const email = data.email.trim();

  const existing = await User.findOne({ where: { email } });

  // 🔥 If user exists but NOT verified → resend OTP
  if (existing && !existing.is_verified) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    existing.otp = otp;
    existing.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);

    await existing.save();

    const html = getOtpEmailTemplate(otp, existing.name);
    await sendEmail(existing.email, "🌿 Verify Your AgroMart Account", html);

    return { message: "OTP resent. Please verify your email." };
  }

  // 🔥 If already verified
  if (existing && existing.is_verified) {
    throw new Error("Email already registered");
  }

  // ✅ Create new user
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({
    name: data.name,
    email,
    password: hashedPassword,
    role: "CUSTOMER",
    otp,
    otp_expiry: new Date(Date.now() + 10 * 60 * 1000),
    is_verified: false
  });

  await Customer.create({
    name: user.name,
    mobile: data.mobile || `TEMP_${user.id}`,
    user_id: user.id
  });

  const html = getOtpEmailTemplate(otp, user.name);
  await sendEmail(user.email, "🌿 Verify Your AgroMart Account", html);

  return { message: "OTP sent. Please check your email." };
};


// ===============================
// ✅ LOGIN
// ===============================
export const loginService = async (email, password) => {
  const user = await User.scope(null).findOne({ where: { email } });

  if (!user) throw new Error("User not found");

  if (!user.is_verified) {
    throw new Error("Please verify your email first");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token };
};


// ===============================
// ✅ VERIFY OTP
// ===============================
export const verifyOtpService = async (email, otp) => {
  const user = await User.findOne({ where: { email } });

  if (!user) throw new Error("User not found");

  if (!user.otp_expiry || new Date(user.otp_expiry) < new Date()) {
    throw new Error("OTP expired. Please request a new one.");
  }

  if (user.otp !== otp) throw new Error("Invalid OTP");

  user.is_verified = true;
  user.otp = null;
  user.otp_expiry = null;

  await user.save();

  return { message: "Email verified successfully" };
};


// ===============================
// ✅ RESEND OTP
// ===============================
export const resendOtpService = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) throw new Error("User not found");

  if (user.is_verified) {
    throw new Error("User already verified");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  const html = getOtpEmailTemplate(otp, user.name);
  await sendEmail(user.email, "🌿 Your New OTP - AgroMart", html);

  return { message: "OTP resent successfully" };
};


// ===============================
// ✅ FORGOT PASSWORD
// ===============================
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ where: { email: email.trim() } });

  if (!user) throw new Error("User with this email not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await user.save();

  const html = getOtpEmailTemplate(otp, user.name);
  await sendEmail(user.email, "🔐 Password Reset OTP - AgroMart", html);

  return { message: "Recovery OTP sent to your email" };
};


// ===============================
// ✅ RESET PASSWORD
// ===============================
export const resetPasswordService = async (email, otp, newPassword) => {
  const user = await User.findOne({ where: { email: email.trim() } });

  if (!user) throw new Error("User not found");

  if (!user.otp_expiry || new Date(user.otp_expiry) < new Date()) {
    throw new Error("OTP expired. Please request a new one.");
  }

  if (user.otp !== otp) throw new Error("Invalid OTP");

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.otp = null;
  user.otp_expiry = null;

  await user.save();

  return { message: "Password reset successful. Please login." };
};