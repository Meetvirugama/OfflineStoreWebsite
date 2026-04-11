import Groq from "groq-sdk";
import { ENV } from "../../config/env.js";

const groq = new Groq({
    apiKey: ENV.GROQ_KEY
});

const MODEL = "llama3-70b-8192";

/**
 * FEATURE 1: Generate Smart AI Advisory
 */
export const getAdvisoryAI = async (crop, stage, weather, rules) => {
    try {
        const prompt = `
            You are a professional agricultural advisor.
            Crop: ${crop}
            Growth Stage: ${stage}
            Current Weather: Temp ${weather.temp}°C, Humidity ${weather.humidity}%, Rain: ${weather.rain ? 'Yes' : 'No'}
            Our Internal Rules suggest: ${rules.join(" ")}
            
            Based on this information, provide a short, simple, and farmer-friendly advice.
            Focus on actionable steps. Keep it under 50 words.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL,
        });

        return completion.choices[0]?.message?.content || "No advice available at the moment.";
    } catch (error) {
        console.error("GROQ API Error (Advisory):", error);
        return rules.length > 0 ? rules.join(" ") : "Maintain standard care for your crop. Monitor weather changes.";
    }
};

/**
 * FEATURE 2: Disease Insight
 */
export const getDiseaseInsightAI = async (crop, disease) => {
    try {
        const prompt = `
            Explain the following plant disease for a farmer.
            Crop: ${crop}
            Disease: ${disease}
            
            Provide the response in the following JSON format:
            {
              "cause": "short explanation of the cause",
              "prevention": "short prevention steps",
              "treatment": "short treatment steps"
            }
            Keep it simple and direct.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL,
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(completion.choices[0]?.message?.content);
        return content;
    } catch (error) {
        console.error("GROQ API Error (Disease):", error);
        return {
            cause: "Unable to retrieve cause. Consult a local expert.",
            prevention: "Common prevention includes crop rotation and clean tools.",
            treatment: "Treat with appropriate fungicides or organic alternatives."
        };
    }
};

/**
 * FEATURE 3: Farmer Chatbot
 */
export const getChatResponseAI = async (message) => {
    try {
        const prompt = `
            You are a helpful assistant for a farmer. 
            The farmer asks: "${message}"
            Give a short, simple, and friendly answer in English. 
            Avoid technical jargon.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL,
        });

        return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Can you simplify your question?";
    } catch (error) {
        console.error("GROQ API Error (Chat):", error);
        return "I am currently offline. Please try again later for farming advice.";
    }
};

/**
 * ENHANCEMENT: Strategic Advisory
 */
export const generateStrategicAdvisory = async (crop, stage, weather, rules) => {
    try {
        const prompt = `
            You are a senior agricultural strategist.
            Crop: ${crop}
            Stage: ${stage}
            Weather Context: ${JSON.stringify(weather)}
            Critical Alerts: ${rules.map(r => r.message).join(" ")}
            
            Synthesize these alerts into a single cohesive "Strategic Expert Note" for the farmer.
            Be professional, encouraging, and highly specific. Keep it under 60 words.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("GROQ API Error (Strategic Advisory):", error);
        return "";
    }
};

/**
 * ENHANCEMENT: Market Trend Analysis
 */
export const analyzeMarketInsights = async (crop, trends) => {
    try {
        const prompt = `
            Analyze these 7-day price trends for ${crop} and provide a professional market outlook for a farmer.
            Trend Data (Date: Price): ${trends.map(t => `${t.date}: ${t.price}`).join(", ")}
            
            Provide a 2-3 sentence recommendation (buy, sell, hold, or store) with clear reasoning based on price velocity.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("GROQ API Error (Market Analysis):", error);
        return "";
    }
};

/**
 * ENHANCEMENT: Weather Strategic Outlook
 */
export const generateWeatherOutlook = async (forecast) => {
    try {
        const prompt = `
            Given this 7-day weather forecast summary: ${JSON.stringify(forecast)}
            
            Provide a "Farmer's Strategic Outlook" (2-3 sentences).
            Translate raw weather data into practical farming decisions for the coming week (e.g., when to sow, spray, or harvest).
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("GROQ API Error (Weather Outlook):", error);
        return "";
    }
};
