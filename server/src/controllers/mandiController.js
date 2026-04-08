import {
    getPaginatedMandiPrices,
    getCropTrends,
    getDistrictTrends,
    getMarketTrends,
    getMandiDashboardSummary,
    getBestMandiForCrop,
    getMultiCropTrends,
    syncMandiData,
    injectMockMandiData
} from "../services/mandiService.js";

/**
 * GET PRICES (TABLE DATA)
 */
export const getPrices = async (req, res) => {
    try {
        const { state, district, commodity, date, page, limit } = req.query;
        const filters = { state, district, commodity, date };
        
        const data = await getPaginatedMandiPrices(filters, parseInt(page) || 1, parseInt(limit) || 20);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET CROP TRENDS (GRAPH DATA)
 */
export const getCropTrendAnalytics = async (req, res) => {
    try {
        const { commodity, days } = req.query;
        if (!commodity) return res.status(400).json({ message: "Commodity name required" });

        const data = await getCropTrends(commodity, parseInt(days) || 30);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET DISTRICT COMPARISON (GRAPH DATA)
 */
export const getDistrictTrendAnalytics = async (req, res) => {
    try {
        const { commodity } = req.query;
        const data = await getDistrictTrends(commodity);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET MARKET COMPARISON
 */
export const getMarketTrendAnalytics = async (req, res) => {
    try {
        const { commodity } = req.query;
        const data = await getMarketTrends(commodity);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * BEST MANDI FOR CROP
 */
export const getBestMandi = async (req, res) => {
    try {
        const { commodity } = req.query;
        const data = await getBestMandiForCrop(commodity);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * DASHBOARD SUMMARY STATS
 */
export const getDashboardSummary = async (req, res) => {
    try {
        const data = await getMandiDashboardSummary();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET MULTI CROP COMPARISON
 */
export const getMultiCropTrendAnalytics = async (req, res) => {
    try {
        const { crops, days } = req.query;
        if (!crops) return res.status(400).json({ message: "Crops list required (comma separated)" });

        const data = await getMultiCropTrends(crops, parseInt(days) || 30);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * TRIGGER MANUAL SYNC (ADMIN ONLY)
 */
export const triggerManualSync = async (req, res) => {
    try {
        const { state } = req.body;
        const result = await syncMandiData(state || "Gujarat");
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * TRIGGER MOCK SYNC (DEMO ONLY)
 */
export const triggerMockSync = async (req, res) => {
    try {
        const result = await injectMockMandiData();
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

