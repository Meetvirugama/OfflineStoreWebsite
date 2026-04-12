import Groq from "groq-sdk";
import { ENV } from "../../config/env.js";

const MODEL = "llama-3.3-70b-versatile";

let groqClient = null;

const getGroqClient = () => {
    if (groqClient) return groqClient;
    if (!ENV.GROQ_KEY) {
        console.warn("⚠️ [AI] GROQ_API_KEY is missing. AI features will use fallback logic.");
        return null;
    }
    groqClient = new Groq({ apiKey: ENV.GROQ_KEY });
    return groqClient;
};

/**
 * FEATURE 1: Generate Smart AI Advisory
 */
export const getAdvisoryAI = async (crop, stage, weather, rules) => {
    const groq = getGroqClient();
    if (!groq) return rules.length > 0 ? rules.join(" ") : "Maintain standard care for your crop. Monitor weather changes.";
    
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
    const groq = getGroqClient();
    if (!groq) {
        return {
            cause: "Unable to retrieve cause. Consult a local expert.",
            prevention: "Common prevention includes crop rotation and clean tools.",
            treatment: "Treat with appropriate fungicides or organic alternatives."
        };
    }
    
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
            temperature: 0.2, // ENHANCED ACCURACY
            response_format: { type: "json_object" }
        });

        const rawContent = completion.choices[0]?.message?.content;
        const jsonMatch = rawContent?.match(/\{[\s\S]*?\}/);
        
        let content;
        if (jsonMatch) content = JSON.parse(jsonMatch[0]);
        else content = JSON.parse(rawContent);

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
    const groq = getGroqClient();
    if (!groq) return "I am currently offline. Please try again later for farming advice.";
    
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
    const groq = getGroqClient();
    if (!groq) return "";
    
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
    const groq = getGroqClient();
    if (!groq) return "";
    
    try {
        const prompt = `
            Analyze these 7-day price trends for ${crop} and provide a professional market outlook for a farmer.
            Trend Data (Date: Price): ${trends.map(t => `${t.date}: ${t.price}`).join(", ")}
            
            Provide the response in the following JSON format:
            {
              "recommendation": "2-3 sentence recommendation with reasoning",
              "velocity": "HIGH/MEDIUM/LOW",
              "confidence_score": "numerical 0-100"
            }
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL,
            temperature: 0.2,
            response_format: { type: "json_object" }
        });

        const rawContent = completion.choices[0]?.message?.content;
        return JSON.parse(rawContent);
    } catch (error) {
        console.error("GROQ API Error (Market Analysis):", error);
        return { recommendation: "", velocity: "LOW", confidence_score: 0 };
    }
};

/**
 * ENHANCEMENT: Weather Strategic Outlook
 */
export const generateWeatherOutlook = async (forecast) => {
    const groq = getGroqClient();
    if (!groq) return "";
    
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
/**
 * FEATURE 4: Comprehensive Smart Advisory Package
 */
export const getComprehensiveSmartAdvisory = async (data) => {
    const groq = getGroqClient();
    const { crop, stage, location, weather, mandis } = data;

    if (!groq) {
        return {
            advisory_text: "System is currently using fallback logic. Maintain standard crop monitoring.",
            risks: ["Limited real-time AI context available"],
            actions: ["Check local weather forecasts manually", "Monitor crop health daily"],
            best_mandi_reason: "Manual comparison of nearby mandis is advised."
        };
    }

    try {
        const prompt = `
            You are a professional agricultural advisor and market strategist.
            
            CONTEXT:
            Crop: ${crop}
            Growth Stage: ${stage}
            Location: ${location}
            
            WEATHER DATA:
            ${JSON.stringify(weather)}
            
            NEARBY MANDI DATA (Top 3):
            ${JSON.stringify(mandis)}
            
            Based on this information, generate a comprehensive advisory package.
            
            Provide the response in the following JSON format:
            {
              "advisory_text": "2-3 sentences of overall strategic advice",
              "risks": ["Risk 1", "Risk 2", "Risk 3"],
              "actions": ["Action 1", "Action 2", "Action 3", "Action 4", "Action 5"],
              "best_mandi_reason": "1-2 sentences explaining why the identified 'best' mandi is optimal",
              "confidence_score": 95
            }
            
            Ensure the advice is actionable, farmer-friendly, and specific to the crop and conditions provided.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL,
            temperature: 0.2, // ENHANCED ACCURACY
            response_format: { type: "json_object" }
        });

        const rawContent = completion.choices[0]?.message?.content;
        const jsonMatch = rawContent?.match(/\{[\s\S]*?\}/);
        
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return JSON.parse(rawContent);

    } catch (error) {
        console.error("GROQ API Error (Comprehensive Advisory):", error.message);
        return {
            advisory_text: "Strategic advice generation encountered an error. Please follow standard protocol.",
            risks: ["Data synchronization timeout", "Signal variance"],
            actions: ["Verify sensor connectivity", "Monitor crop health daily"],
            best_mandi_reason: "Market analysis failed. Consult local price boards."
        };
    }
};
