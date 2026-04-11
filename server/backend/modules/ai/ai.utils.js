/**
 * Rule-based logic for Crop Advisory
 */
export const applyAdvisoryRules = (weather) => {
    const advice = [];
    
    if (weather.rain) {
        advice.push("Avoid irrigation today due to predicted rainfall to prevent waterlogging.");
    }
    
    if (weather.humidity > 80) {
        advice.push("High humidity detected (above 80%). This increases the risk of fungal diseases. Monitor leaves closely.");
    }
    
    if (weather.temp > 35) {
        advice.push("High temperature alert. Ensure adequate moisture retention and consider mulching.");
    } else if (weather.temp < 15) {
        advice.push("Low temperature detected. Growth may slow down; monitor for cold stress.");
    }

    return advice;
};
