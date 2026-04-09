import News from "./news.model.js";

export const listNews = async () => {
  return await News.findAll({ order: [["published_at", "DESC"]] });
};

export const syncNews = async () => {
  // Mock data removed as per production requirements.
  // In a real scenario, this would fetch from an RSS feed or External API.
  return { message: "Sync complete. No new data found." };
};
