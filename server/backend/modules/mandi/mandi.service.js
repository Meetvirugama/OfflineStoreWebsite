import axios from "axios";
import { Op } from "sequelize";
import MandiPrice from "./mandi.model.js";
import { ENV } from "../../config/env.js";

/**
 * Robust date parser for Agmarknet (DD/MM/YYYY)
 */
const parseDataGovDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split("/");
    if (parts.length === 3) {
        // DD/MM/YYYY
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return new Date(dateStr);
};

/**
 * Fetch nearby Mandis from Google Places
 */
export const getNearbyMandis = async (lat, lon, radius = 50000) => {
    if (!ENV.GOOGLE_PLACES_KEY) {
        throw new Error("GOOGLE_PLACES_KEY missing. Cannot fetch live mandi locations.");
    }

    try {
        const keyword = "mandi|APMC|agricultural market";
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
        
        const response = await axios.get(url, {
            params: {
                location: `${lat},${lon}`,
                radius: radius,
                keyword: keyword,
                key: ENV.GOOGLE_PLACES_KEY
            }
        });

        return (response.data.results || []).map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            location: place.geometry.location,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            isOpen: place.opening_hours?.open_now ?? null
        }));
    } catch (err) {
        console.error("Geocoding Error:", err);
        throw new Error("Failed to fetch nearby mandis from API");
    }
};

/**
 * Fetch Live Mandi Prices from data.gov.in and sync to DB
 */
export const getLiveMandiPrices = async (filters = {}) => {
    const { state, district, crop } = filters;
    const API_KEY = ENV.DATA_GOV_KEY;
    const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

    if (!API_KEY) {
        throw new Error("DATA_GOV_API_KEY missing. Cannot fetch live prices.");
    }

    try {
        const params = {
            "api-key": API_KEY,
            format: "json",
            limit: 200
        };

        if (state) params["filters[state]"] = state;
        if (district) params["filters[district]"] = district;
        if (crop) params["filters[commodity]"] = crop;

        const response = await axios.get(`https://api.data.gov.in/resource/${RESOURCE_ID}`, { params });
        const records = response.data.records || [];

        // ASYNC SHADOW SYNC: Don't await this to keep the response fast
        if (records.length > 0) {
            syncPricesToDb(records).catch(err => console.error("Sync Error:", err));
        }

        return records;
    } catch (err) {
        console.error("Data.gov.in API Error:", err.message);
        throw new Error("Failed to fetch live mandi prices from API");
    }
};

/**
 * Utility to sync API records to local database
 */
const syncPricesToDb = async (records) => {
    const formatted = records.map(r => ({
        state: r.state,
        district: r.district,
        market: r.market,
        commodity: r.commodity,
        min_price: parseFloat(r.min_price) || 0,
        max_price: parseFloat(r.max_price) || 0,
        modal_price: parseFloat(r.modal_price) || 0,
        arrival_date: parseDataGovDate(r.arrival_date).toISOString().split('T')[0]
    }));

    // Bulk create with ignore duplicates
    await MandiPrice.bulkCreate(formatted, { ignoreDuplicates: true });
};

/**
 * Get Agri Intelligence Dashboard Stats from Mixed Sources (Live + DB)
 */
export const getAgriDashboardStats = async (state = "Gujarat") => {
    try {
        // 1. Fetch latest prices from API to ensure we are up to date
        const liveRecords = await getLiveMandiPrices({ state });
        
        // 2. Fetch history from DB for trends
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const historicalRecords = await MandiPrice.findAll({
            where: {
                state,
                arrival_date: { [Op.gte]: thirtyDaysAgo.toISOString().split('T')[0] }
            },
            order: [['arrival_date', 'ASC']]
        });

        // Use live records for current summary if available, otherwise fallback to historical
        const recordsToSummarize = liveRecords.length > 0 ? liveRecords : historicalRecords;
        if (recordsToSummarize.length === 0) return null;

        // Core Summary (from latest data)
        const totalMandis = new Set(recordsToSummarize.map(r => r.market || r.market)).size;
        const highestPrice = Math.max(...recordsToSummarize.map(r => parseFloat(r.max_price) || 0));

        // Top Crops (from latest data)
        const cropCounts = {};
        recordsToSummarize.forEach(r => {
            const cropName = r.commodity;
            cropCounts[cropName] = (cropCounts[cropName] || 0) + 1;
        });
        const topCrops = Object.entries(cropCounts)
            .map(([commodity, volume]) => ({ commodity, volume }))
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 5);

        // Trends (from Database)
        const dailyPrices = {};
        historicalRecords.forEach(r => {
            const date = r.arrival_date;
            if (!dailyPrices[date]) dailyPrices[date] = { sum: 0, count: 0 };
            dailyPrices[date].sum += parseFloat(r.modal_price) || 0;
            dailyPrices[date].count += 1;
        });

        const trends = Object.entries(dailyPrices)
            .map(([date, stats]) => ({ date, avg_price: Math.round(stats.sum / stats.count) }))
            .sort((a,b) => new Date(a.date) - new Date(b.date));

        return { totalMandis, highestPrice, topCrops, trends };
    } catch (err) {
        console.error("Agri Stats Error:", err.message);
        throw new Error("Failed to generate live analytics");
    }
};

/**
 * Find the best mandi for a specific crop
 */
export const getBestMandiPrice = async (commodity) => {
    const API_KEY = ENV.DATA_GOV_KEY;
    const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

    try {
        const response = await axios.get(`https://api.data.gov.in/resource/${RESOURCE_ID}`, {
            params: {
                "api-key": API_KEY,
                format: "json",
                limit: 50,
                "filters[commodity]": commodity,
                sort: "modal_price desc"
            }
        });
        return response.data.records?.[0] || null;
    } catch (err) {
        return null;
    }
};

/**
 * Compare trends across multiple crops using Database history
 */
export const getMultiCropComparison = async (crops = [], days = 30, district = null, state = "Gujarat") => {
    try {
        // 1. Trigger a background sync for each crop to keep data fresh
        crops.forEach(crop => {
            getLiveMandiPrices({ state, district, crop }).catch(() => {});
        });

        // 2. Query Database for historical records
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const whereClause = {
            commodity: { [Op.in]: crops },
            arrival_date: { [Op.gte]: startDate.toISOString().split('T')[0] }
        };
        if (state) whereClause.state = state;
        if (district && district !== "all") whereClause.district = district;

        const records = await MandiPrice.findAll({
            where: whereClause,
            order: [['arrival_date', 'ASC']]
        });

        const dateMap = {};
        records.forEach(r => {
            const date = r.arrival_date;
            const crop = r.commodity;
            if (!dateMap[date]) dateMap[date] = { date };
            if (!dateMap[date][crop]) dateMap[date][crop] = { sum: 0, count: 0 };
            dateMap[date][crop].sum += r.modal_price;
            dateMap[date][crop].count += 1;
        });

        return Object.values(dateMap)
            .map(d => {
                const entry = { date: d.date };
                let totalSum = 0;
                let totalCount = 0;

                crops.forEach(c => {
                    if (d[c]) {
                        const avg = Math.round(d[c].sum / d[c].count);
                        entry[c] = avg;
                        totalSum += avg;
                        totalCount++;
                    }
                });

                const finalAvg = totalCount > 0 ? Math.round(totalSum / totalCount) : 0;
                entry.modal = finalAvg;
                entry.avg_price = finalAvg;
                
                return entry;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (err) {
        console.error("MultiCrop Error:", err.message);
        return [];
    }
};

/**
 * Search Mandis via Text
 */
export const searchMandis = async (query) => {
    if (!ENV.GOOGLE_PLACES_KEY) throw new Error("API Key Missing");
    
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
    const response = await axios.get(url, {
        params: {
            query: `${query} APMC Mandi`,
            key: ENV.GOOGLE_PLACES_KEY
        }
    });

    return (response.data.results || []).map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        location: place.geometry.location
    }));
};
