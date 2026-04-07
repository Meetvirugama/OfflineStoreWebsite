import axios from "./axiosInstance";

export const getAllReports = () => axios.get("/reports/all");