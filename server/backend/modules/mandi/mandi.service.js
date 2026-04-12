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
    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);
    
    // List of reliable Overpass Mirrors for redundancy
    const discoveryMirrors = [
        ENV.OVERPASS_API_URL || "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.nchc.org.tw/api/interpreter",
        "https://overpass.osm.ch/api/interpreter"
    ];

    let elements = [];
    let discoveryAttemptSucceeded = false;

    // 1. Discovery Phase: Try mirrors sequentially
    for (const url of discoveryMirrors) {
        try {
            const query = `[out:json][timeout:15];node["marketplace"](around:${radius},${userLat},${userLon});out;`;
            const response = await axios.post(url, query, { 
                headers: { 'Content-Type': 'text/plain' },
                timeout: 10000 
            });
            
            if (response.data && response.data.elements) {
                elements = response.data.elements;
                discoveryAttemptSucceeded = true;
                break; // Found data, stop trying mirrors
            }
        } catch (err) {
            console.warn(`Discovery Mirror Failed (${url}):`, err.message);
            continue; // Try next mirror
        }
    }

    const results = [];
    const cacheEntries = [];

    if (discoveryAttemptSucceeded) {
        // Handle findings from Overpass
        for (const el of elements) {
            const name = el.tags?.name || "Market Node";
            const mLat = el.lat;
            const mLon = el.lon;
            const dist = getDistance(userLat, userLon, mLat, mLon);

            results.push({
                name,
                lat: mLat,
                lng: mLon,
                distance: dist.toFixed(2),
                id: el.id
            });
            
            cacheEntries.push({
                name,
                lat: mLat,
                lng: mLon,
                last_updated: new Date()
            });
        }
        // Async Cache Update
        if (cacheEntries.length > 0) {
            MandiCache.bulkCreate(cacheEntries, { ignoreDuplicates: true }).catch(() => {});
        }
    } else {
        // 2. Fallback Phase: Search Local Database Cache
        console.log("⚠️ External Discovery Failed. Falling back to local cache...");
        
        // Simple bounding box for 50km (~0.45 degrees)
        const latDelta = radius / 111000;
        const lonDelta = radius / (111000 * Math.cos(userLat * Math.PI / 180));

        const cachedMandis = await MandiCache.findAll({
            where: {
                lat: { [Op.between]: [userLat - latDelta, userLat + latDelta] },
                lng: { [Op.between]: [userLon - lonDelta, userLon + lonDelta] }
            },
            limit: 50
        });

        for (const m of cachedMandis) {
            const dist = getDistance(userLat, userLon, m.lat, m.lng);
            results.push({
                name: m.name,
                lat: m.lat,
                lng: m.lng,
                distance: dist.toFixed(2),
                id: m.id
            });
        }
    }

    // 3. Pricing Phase: Merge with latest prices (Legacy or Cache)
    try {
        const enrichedResults = await Promise.all(results.map(async (m) => {
            const cachedPrice = await PriceCache.findOne({
                where: { mandi_name: { [Op.iLike]: `%${m.name}%` } },
                order: [['date', 'DESC']]
            });

            if (cachedPrice) {
                return { ...m, top_crop: cachedPrice.commodity, modal_price: cachedPrice.modal_price };
            }

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

        return enrichedResults.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } catch (err) {
        console.error("Enrichment Error:", err);
        return results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
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
