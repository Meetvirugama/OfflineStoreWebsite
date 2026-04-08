import { create } from "zustand";
import * as reportService from "../api/report.service.js";

const useReportStore = create((set) => ({
  dashboard: {},
  revenue: [],
  products: [],
  loading: false,

  fetchReports: async () => {
    set({ loading: true });
    try {
      const data = await reportService.fetchAllReports();
      set({
        dashboard: data.dashboard || {},
        revenue: data.revenue || [],
        products: data.products || [],
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
    }
  },
}));

export default useReportStore;
