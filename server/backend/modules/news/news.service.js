import axios from "axios";
import { ENV } from "../../config/env.js";
import News from "./news.model.js";

const MOCK_NEWS = [
  {
    title: "India Reaches Record Horticultural Production in 2024",
    description: "The Indian Ministry of Agriculture has announced a 10% increase in fruit and vegetable yields, driven by improved micro-irrigation adoption.",
    link: "https://agrimarket.gov.in",
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=800",
    type: "news",
    published_at: new Date()
  },
  {
    title: "New Climate-Resilient Wheat Varieties Approved for Punjab",
    description: "The ICAR has released three new wheat cultivars that can withstand heat waves during the critical flowering stage.",
    link: "https://icar.org.in",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=800",
    type: "alert",
    published_at: new Date()
  },
  {
    title: "Digital Agriculture Mission: Infrastructure Grant Announced",
    description: "A new ₹2,000 crore fund has been established to support the deployment of IoT sensors and drone technology in rural districts.",
    link: "https://digitalindia.gov.in",
    image: "https://images.unsplash.com/photo-1560340155-a72d73cb2292?auto=format&fit=crop&q=80&w=800",
    type: "news",
    published_at: new Date()
  }
];

export const listNews = async () => {
  const news = await News.findAll({ order: [["published_at", "DESC"]], limit: 20 });
  
  // If empty and no API key, seed with mock data for premium feel
  if (news.length === 0) {
    console.log("🌱 Database empty. Seeding mock agricultural news...");
    await News.bulkCreate(MOCK_NEWS);
    return await News.findAll({ order: [["published_at", "DESC"]], limit: 20 });
  }
  
  return news;
};

export const syncNews = async () => {
  const API_KEY = ENV.NEWS_KEY;
  if (!API_KEY) {
    console.log("⚠️ NEWS_API_KEY missing. Ensuring mock data exists.");
    const count = await News.count();
    if (count === 0) await News.bulkCreate(MOCK_NEWS);
    return { message: "Using curated/mock news due to missing API key." };
  }

    try {
        console.log("📡 Syncing Agricultural News from NewsAPI...");
        const response = await axios.get("https://newsdata.io/api/1/latest", {
            params: {
                apikey: API_KEY,
                q: "agriculture OR farming OR crop",
                language: "en"
            }
        });

        const articles = response.data.results || [];
    
        for (const art of articles) {
            await News.findOrCreate({
                where: { title: art.title },
                defaults: {
                    description: art.description || art.content || "Agricultural insight and updates.",
                    link: art.link,
                    image: art.image_url || MOCK_NEWS[0].image,
                    type: art.category?.[0]?.toLowerCase() === 'technology' ? 'tech' : (art.category?.[0]?.toLowerCase() === 'business' ? 'market' : 'news'),
                    published_at: art.pubDate || new Date()
                }
            });
        }

    return { message: `Sync complete. Processed ${articles.length} articles.` };
  } catch (err) {
    console.error("News Sync Error:", err.message);
    throw new Error("Failed to sync news");
  }
};
