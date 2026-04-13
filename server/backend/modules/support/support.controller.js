import { sendEmail, getSupportInquiryTemplate } from "../../utils/email.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { ENV } from "../../config/env.js";

/**
 * Handle Support Inquiry from Farmer to Admin
 */
export const sendInquiry = asyncHandler(async (req, res) => {
    const { subject, message } = req.body;
    const { name, email } = req.user;

    if (!subject || !message) {
        throw new Error("Subject and message are mandatory for support inquiries.");
    }

    // 1. Send Email to Admin
    const adminEmail = ENV.EMAIL; // Dedicated support receiver
    const emailHtml = getSupportInquiryTemplate(name, email, subject, message);
    
    await sendEmail(
        adminEmail, 
        `New Support Inquiry: ${subject} 🌾`, 
        `New message from ${name}`, 
        emailHtml
    );

    sendResponse(res, 200, "Your inquiry has been dispatched to the administration node. Expect a response via email.");
});
