import { getTopCustomersService, getPendingPaymentsService, getLowStockService, getTopProductsService, getTotalSalesService, getTotalOrdersCount, getTotalCustomersCount, getAgriInsightsService } from "../services/dashboardService.js";

export const getDashboard = async (req, res) => {
    try {
        const [
            totalSales,
            pendingPayments,
            topCustomers,
            topProducts,
            lowStock,
            totalOrders,
            totalCustomers
        ] = await Promise.all([
            getTotalSalesService(),
            getPendingPaymentsService(),
            getTopCustomersService(),
            getTopProductsService(),
            getLowStockService(),
            getTotalOrdersCount(),
            getTotalCustomersCount(),
            getAgriInsightsService()
        ]);

        res.json({
            totalSales,
            pendingPayments,
            topCustomers,
            topProducts,
            lowStock,
            totalOrders,
            totalCustomers,
            agriInsights
        });

    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ message: err.message });
    }
};