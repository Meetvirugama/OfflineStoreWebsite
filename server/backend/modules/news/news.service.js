import axios from "axios";
import { ENV } from "../../config/env.js";
import News from "./news.model.js";

export const listNews = async () => {
  return await News.findAll({ order: [["published_at", "DESC"]], limit: 20 });
};

export const syncNews = async () => {
  const API_KEY = ENV.NEWS_KEY;
  if (!API_KEY) return { message: "NEWS_API_KEY missing. Sync skipped." };

  try {
    console.log("📡 Syncing Agricultural News from NewsAPI...");
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "farming OR agriculture OR agritech India",
        sortBy: "publishedAt",
        language: "en",
        apiKey: API_KEY,
        pageSize: 10
      }
    });

    const articles = response.data.articles || [];
    
    // Convert to our model format and upsert
    for (const art of articles) {
      await News.findOrCreate({
        where: { title: art.title },
        defaults: {
          description: art.description || art.content,
          url: art.url,
          image_url: art.urlToImage,
          source: art.source?.name || "News",
          published_at: art.publishedAt
        }
      });
    }

    return { message: `Sync complete. Processed ${articles.length} articles.` };
  } catch (err) {
    console.error("News Sync Error:", err.message);
    throw new Error("Failed to sync news");
  }
};
