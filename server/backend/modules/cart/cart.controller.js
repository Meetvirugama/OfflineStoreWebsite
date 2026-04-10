import * as cartService from "./cart.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const getMyCart = asyncHandler(async (req, res) => {
    const result = await cartService.getCart(req.user.id);
    sendResponse(res, 200, "Cart fetched successfully", result);
});

export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, updateType } = req.body;
    await cartService.addItem(req.user.id, productId, quantity || 1, updateType || 'relative');
    sendResponse(res, 201, "Cart updated successfully");
});

export const remove = asyncHandler(async (req, res) => {
    await cartService.removeItem(req.params.id);
    sendResponse(res, 200, "Item removed from cart");
});

export const updateQty = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    await cartService.updateItemQty(id, quantity);
    sendResponse(res, 200, "Quantity updated");
});

export const clear = asyncHandler(async (req, res) => {
    await cartService.clearCart(req.user.id);
    sendResponse(res, 200, "Cart cleared");
});
