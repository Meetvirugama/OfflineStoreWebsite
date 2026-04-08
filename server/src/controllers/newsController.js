import * as newsService from "../services/newsService.js";

export const getNews = async (req, res) => {
    try {
        const { type, category } = req.query;
        const news = await newsService.getFarmingNews({ type, category });
        res.json(news);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const syncNews = async (req, res) => {
    try {
        const result = await newsService.syncFarmingNews();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
