import { getMarketOutlook } from "./analytics.service.js";

export const marketOutlookController = async (req, res, next) => {
    try {
        const commodity = req.query.commodity || 'unknown';
        const result = await getMarketOutlook({ commodity });
        res.status(200).json({ success: true, message: "Market outlook fetched", data: result });
    } catch (error) {
        next(error);
    }
};
