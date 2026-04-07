import { create } from "zustand";
import { getAllReports } from "../services/reportApi";

const useReportStore = create((set) => ({
  dashboard: {},
  revenue: [],
  products: [],
  clv: [],
  customerType: [],
  payments: [],
  visits: [],
  clicks: [],
  funnel: {},
  conversion: {},
  loading: false,

  fetchReports: async () => {
    set({ loading: true });
    try {
      const res = await getAllReports();
      const data = res.data;
      
      set({
        dashboard: data.dashboard || {},
        revenue: data.revenue || [],
        products: data.products || [],
        clv: data.clv || [],
        customerType: data.customerType || [],
        payments: data.payments || [],
        visits: data.visits || [],
        clicks: data.clicks || [],
        funnel: data.funnel || {},
        conversion: data.conversion || {},
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
      console.error("Failed to fetch reports", err);
    }
  },
}));

export default useReportStore;