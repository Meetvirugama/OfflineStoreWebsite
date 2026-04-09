import sequelize from "../../config/db.js";
import Order from "../order/order.model.js";
import Product from "../product/product.model.js";
import Customer from "../customer/customer.model.js";

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

    // 4. Revenue by Payment Method
    const [payments] = await sequelize.query(`
        SELECT 
            payment_mode,
            SUM(amount) as total_amount
        FROM payment
        GROUP BY payment_mode
    `);

    // 5. Agri-Insights (Mocking for now to match UI expectations)
    const agriInsights = {
        topCrops: [
            { commodity: "Wheat", volume: 450 },
            { commodity: "Rice", volume: 380 },
            { commodity: "Tomato", volume: 290 },
            { commodity: "Onion", volume: 210 }
        ],
        trends: [
            { date: "01 Apr", avg_price: 2100 },
            { date: "02 Apr", avg_price: 2150 },
            { date: "03 Apr", avg_price: 2200 },
            { date: "04 Apr", avg_price: 2180 }
        ],
        demand: [
            { category: "Grains", movement: 60 },
            { category: "Vegetables", movement: 30 },
            { category: "Fruits", movement: 10 }
        ]
    };

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
        funnel: { home: 1200, product: 800, cart: 400, checkout: 200 }, // Mock funnel for now
        conversion: { conversion_rate: 16 }
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
        ORDER BY p.category, p.name
    `);
    
    return data;
};
