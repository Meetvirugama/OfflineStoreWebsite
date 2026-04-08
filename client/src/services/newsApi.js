import axiosInstance from "./axiosInstance";

export const getFarmingNews = async (params = {}) => {
  const response = await axiosInstance.get("/farming-news", { params });
  return response.data;
};

export const syncNews = async () => {
  const response = await axiosInstance.post("/farming-news/sync");
  return response.data;
};
