import * as newsService from "./news.service.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { sendResponse } from "../../utils/response.js";

export const getNews = asyncHandler(async (req, res) => {
  const news = await newsService.listNews();
  sendResponse(res, 200, "News fetched successfully", news);
});

export const sync = asyncHandler(async (req, res) => {
  const result = await newsService.syncNews();
  sendResponse(res, 200, result.message, null);
});
