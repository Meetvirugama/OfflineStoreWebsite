import { generateAIInsight } from "../../utils/groq.js";

// Dummy data for missing modules just to provide the fallbacks as described
const getMockData = (commodity) => {
    return {
        commodity,
        current_price: 2500,
        predicted_price: 2600,
        trend: 100, // positive trend
        volatility: "High"
    };
};

export async function getMarketOutlook(queryData) {
  const data = getMockData(queryData.commodity || 'unknown');
  
  // Step 1: Existing logic (fallback)
  let signal = "HOLD";

  if (data.trend > 0) signal = "SELL";
  if (data.trend < 0) signal = "WAIT";

  // Step 2: AI Enhancement
  let aiResponse = null;
  let parsedAiResponse = null;
  
  try {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('AI Request timeout')), 2000);
    });
    
    const rawAiResponse = await Promise.race([
        generateAIInsight(data),
        timeoutPromise
    ]);
    
    clearTimeout(timeoutId);
    aiResponse = rawAiResponse;
    const jsonMatch = aiResponse?.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
        parsedAiResponse = JSON.parse(jsonMatch[0]);
    } else {
        parsedAiResponse = JSON.parse(aiResponse);
    }
  } catch (err) {
    console.log("AI failed, fallback used:", err.message);
  }

  const finalSignal = parsedAiResponse?.market_outlook || parsedAiResponse?.signal || signal;
  const finalReason = parsedAiResponse?.short_explanation || parsedAiResponse?.reason || "Prices are governed by standard moving averages and recent trading volume thresholds.";
  const finalRisk = parsedAiResponse?.risk_level || parsedAiResponse?.risk || (data.volatility === "High" ? "HIGH" : "MEDIUM");

  return {
    signal: finalSignal,
    reason: finalReason,
    risk: finalRisk,
    confidence: parsedAiResponse?.confidence_score || (parsedAiResponse ? 95 : 60),
    velocity: parsedAiResponse?.velocity || (data.trend > 0 ? "HIGH" : "LOW"),
    // Optional (Advanced): Logging the original response
    raw_ai_insight: parsedAiResponse || aiResponse
  };
}
