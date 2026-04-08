import axios from "axios";
import { FarmingNews } from "../models/index.js";
import { Op } from "sequelize";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = "https://newsapi.org/v2/everything";

const WHITELIST = ["farm", "farmer", "agriculture", "crop", "mandi", "irrigation", "rainfall", "harvest", "fertilizer", "kisan"];
const BLACKLIST = ["stock market", "crypto", "bollywood", "celebrity", "politics", "entertainment", "sports"];

const ANNOUNCEMENT_KEYWORDS = ["scheme", "yojana", "subsidy", "government", "policy", "budget", "pension"];

/**
 * FETCH AND FILTER NEWS
 */
export const syncFarmingNews = async () => {
    if (!NEWS_API_KEY) {
        console.error("❌ NEWS_API_KEY missing in .env");
        return { success: false, message: "API Key missing" };
    }

    try {
        const query = "(farming OR agriculture OR crops OR mandi OR fertilizer OR irrigation OR किसान OR खेती) AND (india OR gujarat)";
        const response = await axios.get(NEWS_API_URL, {
            params: {
                q: query,
                sortBy: "publishedAt",
                apiKey: NEWS_API_KEY,
                language: "en"
            }
        });

        const articles = response.data.articles || [];
        let savedCount = 0;

        for (const article of articles) {
            const content = `${article.title} ${article.description}`.toLowerCase();

            // 1. Strict Filtering (Whitelist)
            const hasWhitelist = WHITELIST.some(word => content.includes(word));
            if (!hasWhitelist) continue;

            // 2. Strict Filtering (Blacklist)
            const hasBlacklist = BLACKLIST.some(word => content.includes(word));
            if (hasBlacklist) continue;

            // 3. Classification
            const isAnnouncement = ANNOUNCEMENT_KEYWORDS.some(word => content.includes(word));
            const type = isAnnouncement ? "announcement" : "news";
            const priority = isAnnouncement ? "HIGH" : "NORMAL";

            // 4. Save to DB (Prevent duplicates with link)
            try {
                const [news, created] = await FarmingNews.findOrCreate({
                    where: { link: article.url },
                    defaults: {
                        title: article.title,
                        description: article.description,
                        type,
                        image: article.urlToImage,
                        link: article.url,
                        priority,
                        category: isAnnouncement ? "Government Schemes" : "Latest Updates",
                        published_at: article.publishedAt
                    }
                });

                if (created) savedCount++;
            } catch (err) {
                console.error("Error saving article:", err.message);
            }
        }

        console.log(`✅ News Sync Completed! Saved ${savedCount} new articles.`);
        return { success: true, savedCount };
    } catch (err) {
        console.error("❌ News Sync Failed:", err.message);
        throw err;
    }
};

/**
 * GET NEWS FOR FRONTEND
 */
export const getFarmingNews = async (filters = {}) => {
    const where = {};
    if (filters.type) where.type = filters.type;
    if (filters.category) where.category = filters.category;

    return await FarmingNews.findAll({
        where,
        order: [
            ["priority", "DESC"],
            ["published_at", "DESC"]
        ],
        limit: 50
    });
};
