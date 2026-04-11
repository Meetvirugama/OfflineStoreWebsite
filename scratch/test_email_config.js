
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../server/backend/.env") });

console.log("Checking Environment Variables...");
console.log("EMAIL:", process.env.EMAIL ? "FOUND" : "MISSING");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "FOUND" : "MISSING");

const testTransporter = async () => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log("Verifying SMTP connection...");
        await transporter.verify();
        console.log("✅ SMTP Verification Successful!");
    } catch (error) {
        console.error("❌ SMTP Verification Failed:", error.message);
        console.error("DEBUG INFO:", {
            host: "smtp.gmail.com",
            port: 465,
            user: process.env.EMAIL,
            hasPass: !!process.env.EMAIL_PASS
        });
    }
};

testTransporter();
