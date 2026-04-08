import axios from "axios";

/**
 * FETCH WEATHER AND PROVIDE CROP RECOMMENDATIONS
 */
export const getWeatherRecommendation = async (cropName, lat = 22.3072, lon = 70.8022) => {
    try {
        const apiKey = process.env.WEATHER_API_KEY;
        let weatherData;

        if (!apiKey || apiKey === "YOUR_API_KEY") {
            // Mock data for demonstration if API key is missing
            console.log("⚠️ WEATHER_API_KEY missing. Using mock data.");
            weatherData = {
                main: { temp: 28, humidity: 65 },
                weather: [{ description: "clear sky" }],
                name: "Rajkot"
            };
        } else {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            const response = await axios.get(url);
            weatherData = response.data;
        }

        const temp = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const condition = weatherData.weather[0].description;

        let recommendation = "";

        // Simple logic based on crop requirements (can be expanded)
        if (temp > 35) {
            recommendation = `The temperature is high (${temp}°C). Ensure intensive irrigation and use shade nets if possible.`;
        } else if (temp < 15) {
            recommendation = `The weather is cool (${temp}°C). Good for crops like Wheat and Mustard. Protect sensitive crops from frost.`;
        } else {
            recommendation = `Conditions are optimal (${temp}°C, ${humidity}% humidity). Perfect time for maintenance and weeding.`;
        }

        if (condition.includes("rain")) {
            recommendation += " Hold off on irrigation; natural rainfall detected.";
        }

        return {
            crop: cropName,
            recommendation,
            weather: {
                location: weatherData.name,
                temperature: temp,
                humidity: humidity,
                condition: condition
            }
        };

    } catch (err) {
        console.error("❌ Weather Service Error:", err.message);
        throw err;
    }
};
