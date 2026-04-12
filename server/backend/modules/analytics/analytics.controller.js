import { getMarketOutlook } from "./analytics.service.js";

export const marketOutlookController = async (req, res, next) => {
    try {
        const commodity = req.query.commodity || 'unknown';
        const result = await getMarketOutlook({ commodity });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
