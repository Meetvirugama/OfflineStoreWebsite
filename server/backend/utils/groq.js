import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateAIInsight(data) {
  if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
  }
  const prompt = `
You are an agricultural market expert.

Given the following data:
- Current Price: ${data.current_price}
- Predicted Price: ${data.predicted_price}
- Trend: ${data.trend}
- Volatility: ${data.volatility}

Provide:
1. Market outlook (SELL / HOLD / WAIT)
2. Short explanation (1-2 lines)
3. Risk level (LOW / MEDIUM / HIGH)

Keep response JSON format.
`;

  const response = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
}
