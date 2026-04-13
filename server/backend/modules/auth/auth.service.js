import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import Customer from "../customer/customer.model.js";
import { ENV } from "../../config/env.js";
// Note: We will need a way to handle Customer creation from here. 
// For now, I will keep the logic and fix dependencies in the final step.

export const register = async (data) => {
    // 1. Check if email already exists
    const existingEmail = await User.findOne({ where: { email: data.email } });
    if (existingEmail && existingEmail.is_verified) {
        throw new Error("This email is already registered and verified. Please login.");
    }

    // 2. Check if mobile already exists (if provided)
    if (data.mobile) {
        const existingMobile = await User.findOne({ where: { mobile: data.mobile } });
        if (existingMobile && existingMobile.id !== existingEmail?.id) {
            throw new Error("This mobile number is already linked to another account.");
        }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user;
    if (existingEmail) {
        // Update the existing unverified user
        user = existingEmail;
        user.name = data.name;
        user.mobile = data.mobile;
        user.password = hashedPassword;
        user.otp = otp;
        user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
    } else {
        // Create a new user
        user = await User.create({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            password: hashedPassword,
            otp,
            otp_expiry: new Date(Date.now() + 10 * 60 * 1000),
            is_verified: false
        });
    }

    // 3. Send Verification Email (Non-blocking background task)
    (async () => {
        try {
            const { sendEmail, getOTPTemplate } = await import("../../utils/email.js");
            const emailHtml = getOTPTemplate(otp, data.name || "Farmer");
            await sendEmail(data.email, "Verify your AgroMart Account 🌾", `Your verification code is ${otp}`, emailHtml);
        } catch (err) {
            console.error("Delayed Registration Email Error:", err);
        }
    })();

    return { name: user.name, email: user.email, otp }; 
};

export const login = async (email, password) => {
    const user = await User.scope(null).findOne({ where: { email } });
    if (!user) throw new Error("User not found");
    
    // Bypass verification in development/demo mode
    if (ENV.NODE_ENV === "production" && !user.is_verified) {
        throw new Error("Please verify your email first");
    }

    const isMatch = await bcrypt.compare(String(password), String(user.password || ""));
    if (!isMatch) throw new Error("Invalid password");

    const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        ENV.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { token, user: { id: user.id, name: user.name, role: user.role } };
};

export const verifyOtp = async (email, otp) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");
    if (user.otp !== otp || new Date(user.otp_expiry) < new Date()) {
        throw new Error("Invalid or expired OTP");
    }

    user.is_verified = true;
    user.otp = null;
    user.otp_expiry = null;
    await user.save();

    // Link Customer record if role is CUSTOMER
    if (user.role === "CUSTOMER") {
        await Customer.findOrCreate({
            where: { user_id: user.id },
            defaults: {
                name: user.name,
                email: user.email,
                mobile: user.mobile || ""
            }
        });
    }

    // 3. Welcome Email
    try {
        const { sendEmail, getWelcomeTemplate } = await import("../../utils/email.js");
        const emailHtml = getWelcomeTemplate(user.name || "Farmer");
        await sendEmail(user.email, "Welcome to the AgroMart Network! 🌾", `Your account is now active.`, emailHtml);
    } catch (err) {
        console.error("Delayed Welcome Email Error:", err);
    }

    return { message: "Email verified successfully" };
};

export const resendOtp = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");
    if (user.is_verified) throw new Error("Email already verified");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send Resend Email (Non-blocking)
    (async () => {
        try {
            const { sendEmail, getOTPTemplate } = await import("../../utils/email.js");
            const emailHtml = getOTPTemplate(otp, user.name || "Farmer");
            await sendEmail(user.email, "Your new AgroMart Verification Code 🌾", `Your new code is ${otp}`, emailHtml);
        } catch (err) {
            console.error("Delayed Resend Email Error:", err);
        }
    })();

    return { email, otp };
};

export const googleLogin = async (userData) => {
    let user = await User.findOne({ where: { email: userData.email } });

    if (!user) {
        user = await User.create({
            name: userData.name,
            email: userData.email,
            is_verified: true,
            role: "CUSTOMER",
            auth_provider: "GOOGLE"
        });
    }

    // Link/Create Customer record
    if (user.role === "CUSTOMER") {
        await Customer.findOrCreate({
            where: { user_id: user.id },
            defaults: {
                name: user.name,
                email: user.email,
                mobile: user.mobile || "" // Will be empty for Google users initially
            }
        });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        ENV.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { token, user: { id: user.id, name: user.name, role: user.role } };
};

export const forgotPassword = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send Recovery Email (Non-blocking)
    (async () => {
        try {
            const { sendEmail, getRecoveryTemplate } = await import("../../utils/email.js");
            const emailHtml = getRecoveryTemplate(otp, user.name || "Farmer");
            await sendEmail(user.email, "Reset your AgroMart Password 🔐", `Your recovery code is ${otp}`, emailHtml);
        } catch (err) {
            console.error("Delayed Recovery Email Error:", err);
        }
    })();

    return { email, message: "Recovery OTP sent" };
};

export const resetPassword = async (email, otp, newPassword) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");
    if (user.otp !== otp || new Date(user.otp_expiry) < new Date()) {
        throw new Error("Invalid or expired recovery code");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otp_expiry = null;
    await user.save();

    return { message: "Password updated successfully. You can now login." };
};
