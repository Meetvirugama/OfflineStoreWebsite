import { getSeasonalSuggestions } from "./cropService.js";

/**
 * CROP_CONSTRAINTS
 * Biological thresholds for different crop varieties.
 */
const CROP_CONSTRAINTS = {
    "Wheat": { temp_max: 32, humidity_max: 75, water_sensitivity: "MEDIUM", season: "Winter" },
    "Rice": { temp_max: 38, humidity_max: 95, water_sensitivity: "HIGH", season: "Monsoon" },
    "Cotton": { temp_max: 36, humidity_max: 85, water_sensitivity: "MEDIUM", season: "Monsoon" },
    "Sugarcane": { temp_max: 42, humidity_max: 90, water_sensitivity: "EXTREME", season: "Year-Round" },
    "Mustard": { temp_max: 30, humidity_max: 80, water_sensitivity: "LOW", season: "Winter" },
    "Groundnut": { temp_max: 35, humidity_max: 80, water_sensitivity: "MEDIUM", season: "Monsoon" }
};

export const generateAdvisory = (weather, crop, stage) => {
    const advisories = [];
    let riskPoints = 0;

    const temp = weather.main?.temp || weather.temp;
    const humidity = weather.main?.humidity || weather.humidity;
    const rain = weather.rain?.['1h'] || weather.rain?.['3h'] || 0;
    const condition = (weather.weather?.[0]?.main || "").toLowerCase();
    
    const constraints = CROP_CONSTRAINTS[crop] || { temp_max: 35, humidity_max: 85, water_sensitivity: "MEDIUM", season: "Any" };

    // 0. SEASONALITY CHECK
    const currentSeasonData = getSeasonalSuggestions();
    const isOutOfSeason = constraints.season !== "Any" && 
                         constraints.season !== "Year-Round" && 
                         !currentSeasonData.season.includes(constraints.season);

    if (isOutOfSeason) {
        advisories.push({
            type: "ACCURACY",
            title: "Season Mismatch Alert",
            message: `${crop} is typically a ${constraints.season} crop. Growing it during the current ${currentSeasonData.season} season may lead to suboptimal yields and higher pest pressure.`,
            icon: "🗓️"
        });
        riskPoints += 4;
    }

    // 1. WATER & IRRIGATION RULES
    if (rain > 15) { // Threshold increased from 5 to 15 for better accuracy
        advisories.push({
            type: "WATER",
            title: "Significant Rainfall",
            message: "Heavy rain detected. Ensure drainage channels are clear to prevent water stagnation around the root zone.",
            icon: "🌊"
        });
        riskPoints += 2;
    } else if (temp > constraints.temp_max) {
        advisories.push({
            type: "WATER",
            title: "Critical Heat Stress",
            message: `Current temp (${temp}°C) exceeds the optimal threshold for ${crop} (${constraints.temp_max}°C). Ensure soil remains moist via mulching or evening irrigation.`,
            icon: "🔥"
        });
        riskPoints += 3;
    }

    // 2. DISEASE & PEST RULES
    if (humidity > constraints.humidity_max) {
        advisories.push({
            type: "DISEASE",
            title: "Elevated Pest Window",
            message: `High relative humidity (${humidity}%) detected. This environment is highly conducive for ${crop}-specific pests and fungal pathogens.`,
            icon: "🦠"
        });
        riskPoints += 3;
    }

    // 3. STAGE-SPECIFIC INTELLIGENCE
    const normalizedStage = stage.toLowerCase();
    
    if (normalizedStage.includes("sowing")) {
        if (rain > 20) {
            advisories.push({
                type: "STAGE",
                title: "Sowing Postponement",
                message: "Excessive soil moisture will inhibit proper seed placement and germination. Delay sowing for 48-72 hours.",
                icon: "🌱"
            });
            riskPoints += 3;
        }
    }
    
    // ... rest of stage logic (keeping similar but refined)
    if (normalizedStage.includes("flowering") && temp > (constraints.temp_max + 3)) {
        advisories.push({
            type: "STAGE",
            title: "Pollination Risk",
            message: `Extreme heat during ${crop} flowering phase detected. Consider foliar spray of micronutrients to boost resilience.`,
            icon: "🌸"
        });
        riskPoints += 4;
    }

    // 4. RISK CALCULATION
    let risk_level = "LOW";
    if (riskPoints >= 8) risk_level = "HIGH";
    else if (riskPoints >= 4) risk_level = "MEDIUM";

    // 5. DEFAULT IF EMPTY
    if (advisories.length === 0) {
        advisories.push({
            type: "GENERAL",
            title: `${crop} Health Check`,
            message: `Environmental parameters are within the optimal range for the ${stage} phase. Maintain monitored nutrient application.`,
            icon: "✅"
        });
    }

    return {
        advisories,
        risk_level,
        processed_at: new Date(),
        accuracy_meta: {
            season_match: !isOutOfSeason,
            crop_thresholds: constraints
        }
    };
};

