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

    // 1. Prepare Admin Email Info
    const adminEmail = ENV.EMAIL || "meetvurigama4902@gmail.com";
    const displayName = name || "Valued Farmer";
    const displayEmail = email || "No Email Provided";

    const emailHtml = getSupportInquiryTemplate(displayName, displayEmail, subject, message);
    
    // 2. Fire and Forget (Non-blocking) so the UI doesn't hang
    sendEmail(
        adminEmail, 
        `New Support Inquiry: ${subject} 🌾`, 
        `New message from ${displayName}`, 
        emailHtml
    ).catch(err => console.error("[SUPPORT-EMAIL-FAIL] Background email dispatch failed:", err.message));

    // 3. Respond immediately to the user
    sendResponse(res, 200, "Your inquiry has been dispatched to the administration node. Expect a response via email.");
});
