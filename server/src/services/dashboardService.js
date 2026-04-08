import { Orders, Customer, OrderItem, Product, Inventory } from "../models/index.js";
import sequelize from "../config/db.js";

export const getTotalSalesService = async () => {
    const result = await Orders.sum("final_amount");
    return result || 0;
};

export const getPendingPaymentsService = async () => {
    const result = await Customer.sum("total_due");
    return result || 0;
};

export const getTopCustomersService = async () => {
    return await Customer.findAll({
        attributes: ["id", "name", "mobile", "total_purchase", "total_due", "tag", "credit_score"],
        order: [["total_purchase", "DESC"]],
        limit: 5
    });
};

export const getTopProductsService = async () => {
    return await OrderItem.findAll({
        attributes: [
            "product_id",
            [sequelize.fn("SUM", sequelize.col("quantity")), "total_sold"],
            [sequelize.fn("SUM", sequelize.col("OrderItem.total")), "revenue"]
        ],
        include: [{ model: Product, attributes: ["name", "category"] }],
        group: ["product_id", "Product.id"],
        order: [[sequelize.literal("total_sold"), "DESC"]],
        limit: 5
    });
};

export const getLowStockService = async () => {
    // 🔥 FIX: lowercase table names to match Sequelize tableName
    const [rows] = await sequelize.query(`
        SELECT
            p.id,
            p.name,
            p.category,
            COALESCE(SUM(i.quantity_change), 0) AS stock
        FROM product p
        LEFT JOIN inventory i ON p.id = i.product_id
        GROUP BY p.id, p.name, p.category
        HAVING COALESCE(SUM(i.quantity_change), 0) < 10
        ORDER BY stock ASC
    `);

    return rows;
};

export const getTotalOrdersCount = async () => {
    return await Orders.count();
};

export const getTotalCustomersCount = async () => {
    return await Customer.count();
};

export const getAgriInsightsService = async () => {
    // Top Crops by Mandi volume
    const [topCrops] = await sequelize.query(`
        SELECT commodity, COUNT(*) as volume, AVG(modal_price) as avg_price
        FROM mandi_prices
        GROUP BY commodity
        ORDER BY volume DESC
        LIMIT 5
    `);

    // Global Price Trends (Last 7 days)
    const [trends] = await sequelize.query(`
        SELECT arrival_date as date, AVG(modal_price) as avg_price
        FROM mandi_prices
        WHERE arrival_date >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY arrival_date
        ORDER BY arrival_date ASC
    `);

    // Demand Insights (Based on inventory movement)
    const [demand] = await sequelize.query(`
        SELECT p.category, SUM(ABS(i.quantity_change)) as movement
        FROM inventory i
        JOIN product p ON i.product_id = p.id
        WHERE i.type = 'OUT'
        GROUP BY p.category
        ORDER BY movement DESC
        LIMIT 3
    `);

    return {
        topCrops,
        trends,
        demand
    };
};