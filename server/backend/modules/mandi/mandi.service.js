import axios from "axios";
import { Op } from "sequelize";
import MandiPrice, { MandiCache, PriceCache } from "./mandi.model.js";
import sequelize from "../../config/db.js";
import { ENV } from "../../config/env.js";
import { getDistance } from "./mandi.utils.js";

/**
 * Robust date parser for Agmarknet (DD/MM/YYYY)
 */
const parseDataGovDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split("/");
    if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return new Date(dateStr);
};

/**
 * Discovery: Fetch nearby Mandis using Overpass API (OpenStreetMap)
 * Plus caching in local DB
 */
export const getNearbyMandis = async (lat, lon, radius = 50000) => {
    try {
        const userLat = parseFloat(lat);
        const userLon = parseFloat(lon);

        // 1. Discovery Phase via Overpass API
        const overpassUrl = ENV.OVERPASS_URL || "https://overpass-api.de/api/interpreter";
        const query = `[out:json];node["marketplace"](around:${radius},${userLat},${userLon});out;`;
        
        const response = await axios.post(overpassUrl, query, { headers: { 'Content-Type': 'text/plain' } });
        const elements = response.data.elements || [];

        const results = [];
        const cacheEntries = [];

        for (const el of elements) {
            const name = el.tags?.name || "Market Node";
            const mLat = el.lat;
            const mLon = el.lon;
            const dist = getDistance(userLat, userLon, mLat, mLon);

            const mandiData = {
                name,
                lat: mLat,
                lng: mLon,
                distance: dist.toFixed(2),
                id: el.id
            };

            results.push(mandiData);
            
            // Prepare for cache
            cacheEntries.push({
                name,
                lat: mLat,
                lng: mLon,
                last_updated: new Date()
            });
        }

        // Async Cache Update
        MandiCache.bulkCreate(cacheEntries, { ignoreDuplicates: true }).catch(() => {});

        // 2. Pricing Phase: Merge with latest Agmarknet prices
        const enrichedResults = await Promise.all(results.map(async (m) => {
            // Check Price Cache first
            const cachedPrice = await PriceCache.findOne({
                where: { mandi_name: { [Op.iLike]: `%${m.name}%` } },
                order: [['date', 'DESC']]
            });

            if (cachedPrice) {
                return { ...m, top_crop: cachedPrice.commodity, modal_price: cachedPrice.modal_price };
            }

            // Fallback: Search in legacy mandi_prices table
            const legacyPrice = await MandiPrice.findOne({
                where: { market: { [Op.iLike]: `%${m.name}%` } },
                order: [['arrival_date', 'DESC']]
            });

            return { 
                ...m, 
                top_crop: legacyPrice?.commodity || "General Supply", 
                modal_price: legacyPrice?.modal_price || 0 
            };
        }));

        // Sort by nearest distance
        return enrichedResults.sort((a, b) => a.distance - b.distance);

    } catch (err) {
        console.error("Discovery Error:", err);
        throw new Error("Failed to discover nearby markets");
    }
};

/**
 * Fetch Live Mandi Prices from data.gov.in and sync to DB
 */
export const getLiveMandiPrices = async (filters = {}) => {
    const { state, district, crop, date, page = 1, limit = 20 } = filters;
    const API_KEY = ENV.DATA_GOV_KEY || ENV.DATA_GOV_API_KEY; 
    const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

    const offset = (page - 1) * limit;

    try {
        const whereClause = {};
        if (state) whereClause.state = state;
        if (district) whereClause.district = district;
        if (crop) whereClause.commodity = crop;
        if (date) whereClause.arrival_date = date;

        const { rows, count } = await MandiPrice.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['arrival_date', 'DESC']]
        });

        if (rows.length === 0 && API_KEY) {
            const params = { "api-key": API_KEY, format: "json", limit: 200 };
            if (state) params["filters[state]"] = state;
            if (district) params["filters[district]"] = district;
            if (crop) params["filters[commodity]"] = crop;

            const response = await axios.get(`https://api.data.gov.in/resource/${RESOURCE_ID}`, { params });
            const records = response.data.records || [];

            if (records.length > 0) {
                await syncPricesToDb(records);
                const refreshed = await MandiPrice.findAndCountAll({
                    where: whereClause,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    order: [['arrival_date', 'DESC']]
                });
                return { records: refreshed.rows, totalCount: refreshed.count };
            }
        }

        return { records: rows, totalCount: count };
    } catch (err) {
        console.error("Mandi API/DB Error:", err.message);
        throw new Error("Failed to fetch mandi prices");
    }
};

/**
 * Sync API records to multi-layer database
 */
const syncPricesToDb = async (records) => {
    const today = new Date().toISOString().split('T')[0];
    
    const legacyFormatted = records.map(r => ({
        state: r.state,
        district: r.district,
        market: r.market,
        commodity: r.commodity,
        min_price: parseFloat(r.min_price) || 0,
        max_price: parseFloat(r.max_price) || 0,
        modal_price: parseFloat(r.modal_price) || 0,
        arrival_date: parseDataGovDate(r.arrival_date).toISOString().split('T')[0]
    }));

    const cacheFormatted = records.map(r => ({
        mandi_name: r.market,
        commodity: r.commodity,
        min_price: parseFloat(r.min_price) || 0,
        max_price: parseFloat(r.max_price) || 0,
        modal_price: parseFloat(r.modal_price) || 0,
        date: today
    }));

    await Promise.all([
        MandiPrice.bulkCreate(legacyFormatted, { ignoreDuplicates: true }),
        PriceCache.bulkCreate(cacheFormatted, { ignoreDuplicates: true })
    ]);
};

/**
 * Get detailed mandi info including full crop catalog
 */
export const getMandiDetails = async (mandiName) => {
    try {
        const prices = await MandiPrice.findAll({
            where: { market: { [Op.iLike]: `%${mandiName}%` } },
            order: [['arrival_date', 'DESC']]
        });

        // Group by commodity to get latest for each
        const catalog = {};
        prices.forEach(p => {
            if (!catalog[p.commodity]) catalog[p.commodity] = p;
        });

        return Object.values(catalog);
    } catch (err) {
        throw new Error("Failed to fetch mandi details");
    }
};

/**
 * Search Mandis via Overpass/Nominatim
 */
export const searchMandis = async (query) => {
    try {
        const nominatimUrl = ENV.NOMINATIM_URL || "https://nominatim.openstreetmap.org/search";
        const response = await axios.get(nominatimUrl, {
            params: { q: `${query} mandi gujarat`, format: 'json', limit: 5 },
            headers: { 'User-Agent': 'AgroMart-ERP/1.0' }
        });

        return (response.data || []).map(place => ({
            id: place.place_id,
            name: place.display_name,
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon)
        }));
    } catch (err) {
        return [];
    }
};

// Legacy Exports for Compatibility
export const getAgriDashboardStats = async (state = "Gujarat") => {
    // Basic fallback implementation
    return { totalMandis: 120, highestPrice: 8500, topCrops: [], trends: [] };
};

export const getBestMandiPrice = async (commodity) => {
    const cached = await PriceCache.findOne({ where: { commodity }, order: [['modal_price', 'DESC']] });
    return cached;
};

export const getMultiCropComparison = async (crops, days, district, state) => [];
export const getDistrictComparison = async (crop, state) => [];
