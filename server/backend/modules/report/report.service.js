import { Op } from "sequelize";
import sequelize from "../../config/db.js";
import Order from "../order/order.model.js";
import Product from "../product/product.model.js";
import Customer from "../customer/customer.model.js";
import Analytics from "../dashboard/dashboard.model.js";
import { getAgriDashboardStats } from "../mandi/mandi.service.js";

export const getDashboardStats = async () => {
    // 1. Summary KPIs
    const total_revenue = await Order.sum("total_amount") || 0;
    const total_orders = await Order.count();
    const total_customers = await Customer.count();
    const avg_order_value = total_orders > 0 ? Math.round(total_revenue / total_orders) : 0;

    // 2. Revenue Timeline (Last 30 Days)
    const [revenue] = await sequelize.query(`
        SELECT 
            TO_CHAR("createdAt", 'DD Mon') as day,
            COALESCE(SUM(total_amount), 0) as revenue,
            COUNT(*) as orders
        FROM orders
        WHERE "createdAt" >= NOW() - INTERVAL '30 days'
        GROUP BY TO_CHAR("createdAt", 'DD Mon'), DATE("createdAt")
        ORDER BY DATE("createdAt") ASC
    `);

    // 3. Top Products by Revenue
    const [products] = await sequelize.query(`
        SELECT 
            p.name,
            SUM(oi.quantity * oi.price) as revenue
        FROM order_item oi
        JOIN product p ON oi.product_id = p.id
        GROUP BY p.name
        ORDER BY revenue DESC
        LIMIT 5
    `);

    // 4. Revenue by Payment Method (Including Pending/Unpaid)
    const [capturedPayments] = await sequelize.query(`
        SELECT 
            payment_mode,
            SUM(amount) as total_amount
        FROM payment
        GROUP BY payment_mode
    `);

    const paidAmount = capturedPayments.reduce((sum, p) => sum + parseFloat(p.total_amount), 0);
    const pendingAmount = Math.max(0, total_revenue - paidAmount);

    const payments = [
        ...capturedPayments,
        { payment_mode: "PENDING / UNPAID", total_amount: pendingAmount }
    ];

    // 5. Visits and Clicks (Real data)
    const [visits] = await sequelize.query(`
        SELECT 
            TO_CHAR("created_at", 'DD Mon') as day,
            COUNT(*) as visits
        FROM analytics
        WHERE type = 'VISIT' AND "created_at" >= NOW() - INTERVAL '30 days'
        GROUP BY TO_CHAR("created_at", 'DD Mon'), DATE("created_at")
        ORDER BY DATE("created_at") ASC
    `);

    const [clicks] = await sequelize.query(`
        SELECT 
            TO_CHAR("created_at", 'DD Mon') as day,
            page,
            COUNT(*) as clicks
        FROM analytics
        WHERE type = 'CLICK' AND "created_at" >= NOW() - INTERVAL '30 days'
        GROUP BY TO_CHAR("created_at", 'DD Mon'), DATE("created_at"), page
        ORDER BY DATE("created_at") ASC
    `);

    // 6. Conversion Rate (Total Orders / Unique Visitors Approximated)
    const totalVisits = await Analytics.count({ where: { type: "VISIT" } });
    const conversion_rate = totalVisits > 0 ? Math.round((total_orders / totalVisits) * 100) : 0;

    // 7. Funnel Generation (Mapping to real paths)
    const funnel = {
        home: await Analytics.count({ where: { type: "VISIT", page: { [Op.iLike]: "%home%" } } }),
        product: await Analytics.count({ where: { type: "VISIT", page: { [Op.iLike]: "%product%" } } }),
        cart: await Analytics.count({ where: { type: "VISIT", page: { [Op.iLike]: "%cart%" } } }),
        checkout: await Analytics.count({ where: { type: "VISIT", page: { [Op.iLike]: "%checkout%" } } })
    };

    // 8. Agri-Insights (Real dynamic data from Data.gov.in)
    const agriInsights = await getAgriDashboardStats();

    return {
        dashboard: {
            total_revenue,
            total_orders,
            total_customers,
            avg_order_value,
            agriInsights
        },
        revenue,
        products,
        payments,
        visits,
        clicks,
        funnel,
        conversion: { conversion_rate }
    };
};

export const getSalesReport = async (startDate, endDate) => {
    const [data] = await sequelize.query(`
        SELECT 
            DATE("createdAt") as date,
            COUNT(*) as total_orders,
            SUM(total_amount) as revenue
        FROM orders
        WHERE "createdAt" BETWEEN :startDate AND :endDate
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
    `, { replacements: { startDate, endDate } });
    
    return data;
};

export const getInventoryReport = async () => {
    const [data] = await sequelize.query(`
        SELECT 
            p.name,
            p.category,
            p.stock,
            p.unit
        FROM product p
        WHERE p."deletedAt" IS NULL
        ORDER BY p.category, p.name
    `);
    
    return data;
};
