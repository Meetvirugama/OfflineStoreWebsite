import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import { ENV } from "../../config/env.js";
// Note: We will need a way to handle Customer creation from here. 
// For now, I will keep the logic and fix dependencies in the final step.

export const register = async (data) => {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing && existing.is_verified) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.upsert({
        id: existing?.id,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        otp,
        otp_expiry: new Date(Date.now() + 10 * 60 * 1000),
        is_verified: false
    });

    // Email logic would be called here or in a separate hook
    return { name: data.name, email: data.email, otp }; 
};

export const login = async (email, password) => {
    const user = await User.scope(null).findOne({ where: { email } });
    if (!user) throw new Error("User not found");
    if (!user.is_verified) throw new Error("Please verify your email first");

    const isMatch = await bcrypt.compare(password, user.password);
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

    return { message: "Email verified successfully" };
};

export const googleLogin = async (userData) => {
    let user = await User.findOne({ where: { email: userData.email } });

    if (!user) {
        user = await User.create({
            name: userData.name,
            email: userData.email,
            is_verified: true,
            role: "CUSTOMER"
        });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        ENV.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { token, user: { id: user.id, name: user.name, role: user.role } };
};
