import { createPurchaseService, getPurchasesService } from "../services/purchaseService.js";

export const createPurchase = async (req, res) => {
    try {
        const data = await createPurchaseService(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getPurchases = async (req, res) => {
    try {
        const data = await getPurchasesService();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};