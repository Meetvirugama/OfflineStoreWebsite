import Supplier from "./supplier.model.js";
import { sendResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/errorHandler.js";

export const create = asyncHandler(async (req, res) => {
    const supplier = await Supplier.create(req.body);
    sendResponse(res, 201, "Supplier created successfully", supplier);
});

export const list = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.findAll();
    sendResponse(res, 200, "Suppliers fetched", suppliers);
});

export const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) throw new Error("Supplier not found");
    await supplier.update(req.body);
    sendResponse(res, 200, "Supplier updated", supplier);
});

export const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) throw new Error("Supplier not found");
    await supplier.destroy();
    sendResponse(res, 200, "Supplier deleted");
});
