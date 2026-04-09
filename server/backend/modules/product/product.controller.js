import * as productService from "./product.service.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const create = asyncHandler(async (req, res) => {
    const result = await productService.createProduct(req.body);
    sendResponse(res, 201, "Product created", result);
});

export const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await productService.updateProduct(id, req.body);
    sendResponse(res, 200, "Product updated", result);
});

export const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await productService.deleteProduct(id);
    sendResponse(res, 200, "Product removed from node");
});

export const list = asyncHandler(async (req, res) => {
    const { search, category, limit } = req.query;
    const result = await productService.listProducts({ search, category, limit });
    sendResponse(res, 200, "Products fetched", result);
});

export const updateStock = asyncHandler(async (req, res) => {
    const { productId, quantity, type, note } = req.body;
    await productService.updateStock(productId, quantity, type, note);
    sendResponse(res, 200, "Stock updated successfully");
});

export const getLowStock = asyncHandler(async (req, res) => {
    const result = await productService.getLowStock();
    sendResponse(res, 200, "Low stock items", result);
});

export const getCategories = asyncHandler(async (req, res) => {
    const result = await productService.getCategories();
    sendResponse(res, 200, "Categories fetched", result);
});
