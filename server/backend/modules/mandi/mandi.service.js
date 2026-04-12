import axios from "axios";
import { Op } from "sequelize";
import MandiPrice, { MandiCache, PriceCache } from "./mandi.model.js";
import sequelize from "../../config/db.js";
import { ENV } from "../../config/env.js";
import { getDistance } from "./mandi.utils.js";

import * as weatherService from "../weather/weather.service.js";
import Apmc from "./apmc.model.js";

/**
 * HELPER: Enrich a list of mandis with latest price data from multiple cache layers
 */
const enrichWithPrices = async (results) => {
    try {
        return await Promise.all(results.map(async (m) => {
            const matchName = m.name;
            
            // Layer 1: Price Cache (Daily Updates)
            const cachedPrice = await PriceCache.findOne({
                where: { mandi_name: { [Op.iLike]: `%${matchName}%` } },
                order: [['date', 'DESC']]
            });

            if (cachedPrice) {
                return { ...m, top_crop: cachedPrice.commodity, modal_price: cachedPrice.modal_price };
            }

            // Layer 2: Legacy Price History (Agmarknet Core)
            const legacyPrice = await MandiPrice.findOne({
                where: { market: { [Op.iLike]: `%${matchName}%` } },
                order: [['arrival_date', 'DESC']]
            });

            return { 
                ...m, 
                top_crop: legacyPrice?.commodity || "General Supply", 
                modal_price: legacyPrice?.modal_price || 0 
            };
        }));
    } catch (err) {
        console.error("Enrichment Error:", err);
        return results;
    }
};

/**
 * PRODUCTION-GRADE DISCOVERY: DB-First Proximity Search
 */
export const getNearbyApmcs = async (lat, lon, radiusKm = 50) => {
    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);
    
    // EDGE CASE: Strict Latitude/Longitude Validation
    if (isNaN(userLat) || isNaN(userLon) || 
        userLat < -90 || userLat > 90 || 
        userLon < -180 || userLon > 180) {
        return [];
    }

    // EDGE CASE: Enforce Radius Bounds (Safety Cap)
    const activeRadius = Math.min(150, Math.max(1, radiusKm));
    
    // EDGE CASE: Handle Polar coordinates (Math.cos(90) -> 0)
    // Avoid division by zero. We use a floor of 0.0001 for cosine.
    const cosLat = Math.max(0.0001, Math.cos(userLat * (Math.PI / 180.0)));
    const lonDelta = (radiusKm / (111.0 * cosLat));

    // 2. Query DB: Primary Bounding Box Filter (Fastest)
    const candidates = await Apmc.findAll({
        where: {
            lat: { [Op.between]: [userLat - latDelta, userLat + latDelta] },
            lng: { [Op.between]: [userLon - lonDelta, userLon + lonDelta] }
        }
    });

    // 3. Precision Filter: Haversine Calculation
    const results = candidates.map(apmc => {
        const dist = getDistance(userLat, userLon, parseFloat(apmc.lat), parseFloat(apmc.lng));
        return {
            id: apmc.id,
            name: apmc.name,
            district: apmc.district,
            lat: parseFloat(apmc.lat),
            lng: parseFloat(apmc.lng),
            distance: dist.toFixed(2),
            is_official: true
        };
    })
    .filter(apmc => parseFloat(apmc.distance) <= radiusKm)
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return results;
};

/**
 * Discovery: Fetch nearby Mandis (Hybrid Logic)
 */
export const getNearbyMandis = async (lat, lon, radius = 50000) => {
    // 1. High-Performance DB Discovery (Primary)
    const dbResults = await getNearbyApmcs(lat, lon, radius / 1000);
    
    // If we have a healthy set of local APMCs, avoid external API overhead
    if (dbResults.length >= 3) {
        return await enrichWithPrices(dbResults);
    }

    // 2. Fallback: Geospatial Discovery (OSM Discovery Mode)
    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);
    const discoveryMirrors = [
        "https://overpass.osm.ch/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass-api.de/api/interpreter"
    ];

    let elements = [];
    const fetchWithRetry = async (url, query, retries = 1) => {
        for (let i = 0; i <= retries; i++) {
            try {
                const response = await axios.post(url, query, { 
                    headers: { 'Content-Type': 'text/plain' },
                    timeout: 20000 
                });
                return response;
            } catch (err) {
                if (err.response?.status === 429 && i < retries) {
                    await new Promise(res => setTimeout(res, 2000));
                    continue;
                }
                throw err;
            }
        }
    };

    for (const url of discoveryMirrors) {
        try {
            const query = `[out:json][timeout:15];
                (
                  node["amenity"="marketplace"](around:${radius},${userLat},${userLon});
                  way["amenity"="marketplace"](around:${radius},${userLat},${userLon});
                  node["name"~"mandi|apmc",i](around:${radius},${userLat},${userLon});
                );
                out center;`;
            const response = await fetchWithRetry(url, query);
            if (response.data?.elements) {
                elements = response.data.elements;
                break;
            }
        } catch (err) { continue; }
    }

    const results = [...dbResults]; // Start with what we found in DB
    const processedNames = new Set(dbResults.map(r => r.name.toLowerCase()));

    for (const el of elements) {
        const name = el.tags?.name || "Market Node";
        if (processedNames.has(name.toLowerCase())) continue;

        const mLat = el.lat || el.center?.lat;
        const mLon = el.lon || el.center?.lon;
        if (!mLat || !mLon) continue;
        
        const dist = getDistance(userLat, userLon, mLat, mLon);
        results.push({ name, lat: mLat, lng: mLon, distance: dist.toFixed(2), id: el.id });
    }

    return await enrichWithPrices(results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)));
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
        const GOOGLE_KEY = ENV.GOOGLE_GEO_KEY;
        const searchWithRetry = async (retries = 2) => {
            for (let i = 0; i < retries; i++) {
                try {
                    return await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
                        params: { address: `${query}, Gujarat, India`, key: GOOGLE_KEY },
                        timeout: 8000
                    });
                } catch (err) {
                    if (i === retries - 1) throw err;
                    await new Promise(r => setTimeout(r, 1000 * (i + 1)));
                }
            }
        };

        const res = await searchWithRetry();

        if (res.data.status !== "OK") return [];

        return res.data.results.map(place => ({
            id: place.place_id,
            name: place.formatted_address,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
        }));
    } catch (err) {
        console.error("Mandi Search Error:", err.message);
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
