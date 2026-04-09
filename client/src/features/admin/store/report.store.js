import { create } from "zustand";
import * as reportService from "../api/report.service.js";

const useReportStore = create((set) => ({
  dashboard: {},
  revenue: [],
  products: [],
  payments: [],
  visits: [],
  funnel: {},
  conversion: {},
  loading: false,

  fetchReports: async () => {
    set({ loading: true });
    try {
      const res = await reportService.fetchAllReports();
      const data = res.data; // Response is { success, message, data: { ... } }
      set({
        dashboard: data.dashboard || {},
        revenue: data.revenue || [],
        products: data.products || [],
        payments: data.payments || [],
        visits: data.visits || [],
        funnel: data.funnel || {},
        conversion: data.conversion || {},
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
    }
  },
}));

export default useReportStore;
