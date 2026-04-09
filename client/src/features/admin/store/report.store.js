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
      // apiClient response interceptor already returns response.data
      // So 'res' is the JSON body: { success, message, data: { ...stats... } }
      // We need the 'data' field which contains our metrics.
      const data = res.data || res; // Fallback in case interceptor changes
      
      console.log("Analytics Data Received:", data);
      
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid analytics data received");
      }

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
