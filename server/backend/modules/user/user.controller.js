import User from "./user.model.js";
import Customer from "../customer/customer.model.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        include: [{ model: Customer }]
    });
    sendResponse(res, 200, "User profile", user);
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { name, email, village, mobile, gst, ...rest } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (!user) return sendResponse(res, 404, "User not found");

    // Update User Info
    await user.update({ name, email });

    // Update Customer Info
    const customer = await Customer.findOne({ where: { user_id: req.user.id } });
    if (customer) {
        await customer.update({ village, mobile, gst, ...rest });
    }

    const updatedUser = await User.findByPk(req.user.id, {
        include: [{ model: Customer }]
    });

    sendResponse(res, 200, "Profile updated successfully", updatedUser);
});
