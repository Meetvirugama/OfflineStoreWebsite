import axios from "axios";
import { Crop, MandiPrice } from "../models/index.js";
import { Op, fn, col } from "sequelize";

const GROWSTUFF_API_URL = "https://www.growstuff.org/crops";

/**
 * FETCH CROP DATA (WITH DB CACHING)
 */
export const getCropData = async (name) => {
    try {
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        
        // 1. Check Database
        let crop = await Crop.findOne({ where: { name: { [Op.iLike]: name } } });
        if (crop) {
            console.log(`📦 Found ${name} in local cache`);
            return { success: true, crop: crop.data, source: "db" };
        }

        // 2. Fetch from GrowStuff (which proxies OpenFarm data)
        console.log(`🌐 Fetching GrowStuff data for ${slug}...`);
        const response = await axios.get(`${GROWSTUFF_API_URL}/${slug}.json`);
        const growData = response.data;

        if (!growData) {
            throw new Error(`Crop "${name}" not found in knowledge base`);
        }

        const openFarm = growData.openfarm_data?.attributes || {};

        // 3. Transform data
        const transformed = {
            name: growData.name || name,
            description: growData.description || openFarm.description || "Agricultural intelligence profile for modern farming.",
            images: [growData.thumbnail_url, openFarm.main_image_path].filter(img => img),
            growing: {
                sowing_method: openFarm.sowing_method || "Consult local agricultural guide",
                spread_cm: openFarm.spread || growData.median_lifespan || "N/A",
                row_spacing_cm: openFarm.row_spacing || "N/A"
            },
            environment: {
                sun: openFarm.sun_requirements || "Full Sun recommended",
                soil: "Well-drained, nutrient-rich soil",
                temperature: "Optimal between 15°C - 30°C"
            },
            watering: {
                frequency: "Regular",
                notes: "Maintain consistent moisture during growth phases."
            },
            harvesting: {
                time: growData.median_days_to_first_harvest ? `${growData.median_days_to_first_harvest} days` : "90-120 days",
                method: "Machine or manual harvest based on scale"
            },
            tips: [
                "Monitor for local pest variants regularly",
                "Apply organic fertilizer during early growth",
                "Ensure proper drainage to prevent root rot"
            ]
        };

        // 4. Save to DB
        await Crop.create({
            name: transformed.name,
            data: transformed
        });

        return { success: true, crop: transformed, source: "api" };

    } catch (err) {
        console.error("❌ Crop Service Error:", err.message);
        throw err;
    }
};


/**
 * GET CROP PRICE TRENDS
 */
export const getCropTrends = async (name, days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await MandiPrice.findAll({
        attributes: [
            [fn('DATE', col('arrival_date')), 'date'],
            [fn('AVG', col('modal_price')), 'price']
        ],
        where: {
            commodity: { [Op.iLike]: `%${name}%` },
            arrival_date: { [Op.gte]: startDate }
        },
        group: [fn('DATE', col('arrival_date'))],
        order: [[fn('DATE', col('arrival_date')), 'ASC']]
    });

    return trends.map(t => ({
        date: t.getDataValue('date'),
        price: parseFloat(t.getDataValue('price')).toFixed(2)
    }));
};
