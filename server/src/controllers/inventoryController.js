import { getAvailableStock, adjustStockService } from "../services/inventoryService.js";

export const getStock = async (req, res) => {
    try {
        const { product_id } = req.params;

        const stock = await getAvailableStock(product_id);

        res.json({
            product_id,
            stock
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const adjustStock = async (req, res) => {
    try {
        const { product_id, quantity, type, reference_type } = req.body;

        if (!product_id || !quantity || !type) {
            return res.status(400).json({ message: "product_id, quantity, and type are required" });
        }

        const inventory = await adjustStockService(
            product_id,
            quantity,
            type.toUpperCase(),
            reference_type || "MANUAL_ADJUSTMENT",
            req.user ? req.user.id : null
        );

        res.status(200).json({ message: "Stock adjusted successfully", inventory });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};