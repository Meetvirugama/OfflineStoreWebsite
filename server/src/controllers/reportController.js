import * as reportService from "../services/reportService.js";

export const getAllReports = async (req, res) => {
  try {
    const [
      dashboard,
      revenue,
      monthly,
      products,
      categories,
      clv,
      customerType,
      segments,
      repeatRate,
      payments,
      visits,
      clicks,
      hourly,
      funnel,
      conversion,
      topDays,
      lowStock
    ] = await Promise.all([
      reportService.getDashboardStats(),
      reportService.getRevenueTrend(),
      reportService.getMonthlyRevenue(),
      reportService.getTopProductsAdvanced(),
      reportService.getTopCategories(),
      reportService.getCustomerCLV(),
      reportService.getCustomerTypeAnalysis(),
      reportService.getCustomerSegments(),
      reportService.getRepeatRate(),
      reportService.getPaymentAnalysis(),
      reportService.getDailyVisits(),
      reportService.getClicksPerDayPerPage(),
      reportService.getHourlyTraffic(),
      reportService.getFunnel(),
      reportService.getConversionRate(),
      reportService.getTopSalesDays(),
      reportService.getLowStockProducts(),
    ]);

    res.json({
      dashboard,
      revenue,
      monthly,
      products,
      categories,
      clv,
      customerType,
      segments,
      repeatRate,
      payments,
      visits,
      clicks,
      hourly,
      funnel,
      conversion,
      topDays,
      lowStock
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};