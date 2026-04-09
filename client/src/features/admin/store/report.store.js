import { create } from "zustand";
import * as reportService from "../api/report.service.js";

const useReportStore = create((set) => ({
  dashboard: {},
  revenue: [],
  products: [],
  payments: [],
  visits: [],
  clicks: [],
  funnel: {},
  conversion: {},
  loading: false,

  fetchReports: async () => {
    set({ loading: true });
    try {
      const res = await reportService.fetchAllReports();
      // res.data is the Axios response body: { success, message, data }
      const data = res.data.data; 
      set({
        dashboard: data.dashboard || {},
        revenue: data.revenue || [],
        products: data.products || [],
        payments: data.payments || [],
        visits: data.visits || [],
        clicks: data.clicks || [],
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
