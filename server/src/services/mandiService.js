import axios from "axios";
import { MandiPrice } from "../models/index.js";
import { Op, fn, col } from "sequelize";

const DATA_GOV_API_BASE = "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24";

/**
 * FETCH AND STORE MANDI DATA (PAGINATION LOOP)
 */
export const syncMandiData = async (state = "Gujarat") => {
    const apiKey = process.env.DATA_GOV_API_KEY;
    if (!apiKey) {
        console.error("❌ DATA_GOV_API_KEY missing in .env");
        return { success: false, message: "API Key missing" };
    }

    let offset = 0;
    let limit = 1000;
    let totalProcessed = 0;
    let hasMore = true;

    console.log(`🚀 Starting Mandi Sync for ${state}...`);

    try {
        while (hasMore) {
            const url = `${DATA_GOV_API_BASE}?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}&filters[state]=${state}`;
            
            const response = await axios.get(url);
            const data = response.data;
            const records = data.records || [];

            if (records.length === 0) {
                hasMore = false;
                break;
            }

            // Batch upsert to prevent duplicates based on composite unique index (market, commodity, arrival_date)
            for (const record of records) {
                const arrival_date = record.arrival_date.split("/").reverse().join("-"); // DD/MM/YYYY to YYYY-MM-DD
                
                await MandiPrice.upsert({
                    state: record.state,
                    district: record.district,
                    market: record.market,
                    commodity: record.commodity,
                    min_price: parseFloat(record.min_price) || 0,
                    max_price: parseFloat(record.max_price) || 0,
                    modal_price: parseFloat(record.modal_price) || 0,
                    arrival_date: arrival_date
                });
            }

            totalProcessed += records.length;
            console.log(`📦 Processed ${totalProcessed} records...`);

            if (records.length < limit) {
                hasMore = false;
            } else {
                offset += limit;
            }
        }

        console.log("✅ Mandi Sync Completed!");
        return { success: true, processed: totalProcessed };
    } catch (err) {
        console.error("❌ Mandi Sync Failed:", err.message);
        throw err;
    }
};

/**
 * ANALYTICS: CROP TRENDS (GROUP BY DATE)
 */
export const getCropTrends = async (commodity, days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await MandiPrice.findAll({
        attributes: [
            ['arrival_date', 'date'],
            [fn('AVG', col('modal_price')), 'avg_price']
        ],
        where: {
            commodity,
            arrival_date: { [Op.gte]: startDate }
        },
        group: ['arrival_date'],
        order: [['arrival_date', 'ASC']]
    });
};

/**
 * ANALYTICS: DISTRICT COMPARISON
 */
export const getDistrictTrends = async (commodity) => {
    return await MandiPrice.findAll({
        attributes: [
            'district',
            [fn('AVG', col('modal_price')), 'avg_price']
        ],
        where: { commodity },
        group: ['district'],
        order: [[fn('AVG', col('modal_price')), 'DESC']]
    });
};

/**
 * ANALYTICS: MARKET COMPARISON
 */
export const getMarketTrends = async (commodity) => {
    return await MandiPrice.findAll({
        attributes: [
            'market',
            [fn('AVG', col('modal_price')), 'avg_price']
        ],
        where: { commodity },
        group: ['market'],
        limit: 10,
        order: [[fn('AVG', col('modal_price')), 'DESC']]
    });
};

/**
 * DASHBOARD SUMMARY
 */
export const getMandiDashboardSummary = async () => {
    const totalMandis = await MandiPrice.count({
        distinct: true,
        col: 'market'
    });

    const topCrops = await MandiPrice.findAll({
        attributes: [
            'commodity',
            [fn('COUNT', col('id')), 'count']
        ],
        group: ['commodity'],
        limit: 5,
        order: [[fn('COUNT', col('id')), 'DESC']]
    });

    const priceBounds = await MandiPrice.findAll({
        attributes: [
            [fn('MAX', col('modal_price')), 'highest'],
            [fn('MIN', col('modal_price')), 'lowest']
        ],
        raw: true
    });

    return {
        totalMandis,
        topCrops,
        highestPrice: priceBounds[0]?.highest || 0,
        lowestPrice: priceBounds[0]?.lowest || 0
    };
};

/**
 * GET BEST MANDI FOR CROP
 */
export const getBestMandiForCrop = async (commodity) => {
    return await MandiPrice.findOne({
        where: { commodity },
        order: [['modal_price', 'DESC']]
    });
};

/**
 * GET PAGINATED PRICES
 */
export const getPaginatedMandiPrices = async (filters, page = 1, limit = 20) => {
    const where = {};
    if (filters.state) where.state = filters.state;
    if (filters.district) where.district = filters.district;
    if (filters.commodity) where.commodity = filters.commodity;
    if (filters.date) where.arrival_date = filters.date;

    const offset = (page - 1) * limit;

    return await MandiPrice.findAndCountAll({
        where,
        limit,
        offset,
        order: [['arrival_date', 'DESC']]
    });
};

/**
 * ANALYTICS: MULTI-CROP COMPARISON
 */
export const getMultiCropTrends = async (commodities, days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const crops = commodities.split(",");

    const results = await MandiPrice.findAll({
        attributes: [
            ['arrival_date', 'date'],
            'commodity',
            [fn('AVG', col('modal_price')), 'avg_price']
        ],
        where: {
            commodity: { [Op.in]: crops },
            arrival_date: { [Op.gte]: startDate }
        },
        group: ['arrival_date', 'commodity'],
        order: [['arrival_date', 'ASC']]
    });

    // Pivot data for Recharts: [{ date: '...', Wheat: 100, Cotton: 200 }, ...]
    const dateMap = {};
    results.forEach(r => {
        const date = r.getDataValue('date');
        if (!dateMap[date]) dateMap[date] = { date };
        dateMap[date][r.commodity] = parseFloat(r.getDataValue('avg_price')).toFixed(2);
    });

    return Object.values(dateMap);
};

/**
 * MOCK DATA INJECTOR (DEMO MODE)
 */
export const injectMockMandiData = async () => {
    const markets = ["Rajkot", "Gondal", "Ahmedabad", "Surat"];
    const commodities = ["Wheat", "Cotton", "Groundnut"];
    const districts = { "Rajkot": "Rajkot", "Gondal": "Rajkot", "Ahmedabad": "Ahmedabad", "Surat": "Surat" };

    let count = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const arrival_date = new Date(today);
        arrival_date.setDate(today.getDate() - i);
        const dateStr = arrival_date.toISOString().split('T')[0];

        for (const market of markets) {
            for (const commodity of commodities) {
                // Generate semi-realistic price fluctuation
                const base = commodity === "Wheat" ? 2200 : commodity === "Cotton" ? 7000 : 5500;
                const variance = Math.sin(i * 0.5) * 200 + (Math.random() * 100);
                const modal = Math.round(base + variance);

                await MandiPrice.upsert({
                    state: "Gujarat",
                    district: districts[market],
                    market: market,
                    commodity: commodity,
                    min_price: modal - 200,
                    max_price: modal + 200,
                    modal_price: modal,
                    arrival_date: dateStr
                });
                count++;
            }
        }
    }
    return { success: true, count };
};
