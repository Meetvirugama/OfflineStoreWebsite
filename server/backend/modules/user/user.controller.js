import User from "./user.model.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id);
    sendResponse(res, 200, "User profile", user);
});

export const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id);
    await user.update(req.body);
    sendResponse(res, 200, "Profile updated", user);
});
