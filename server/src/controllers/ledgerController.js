import { getCustomerLedgerService } from "../services/ledgerService.js";

export const getCustomerLedger = async (req, res) => {
    try {
        const { customer_id } = req.params;

        if (!customer_id) {
            return res.status(400).json({
                message: "customer_id is required"
            });
        }

        const data = await getCustomerLedgerService(customer_id);

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        console.error("Ledger Fetch Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};