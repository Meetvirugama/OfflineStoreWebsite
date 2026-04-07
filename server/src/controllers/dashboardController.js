import { getTopCustomersService, getPendingPaymentsService, getLowStockService, getTopProductsService, getTotalSalesService, getTotalOrdersCount, getTotalCustomersCount } from "../services/dashboardService.js";

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
            getTotalCustomersCount()
        ]);

        res.json({
            totalSales,
            pendingPayments,
            topCustomers,
            topProducts,
            lowStock,
            totalOrders,
            totalCustomers
        });

    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ message: err.message });
    }
};