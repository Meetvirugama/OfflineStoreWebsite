import sequelize from "../../config/db.js";

export const getSalesReport = async (startDate, endDate) => {
    const [data] = await sequelize.query(`
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as total_orders,
            SUM(total_amount) as revenue
        FROM orders
        WHERE created_at BETWEEN :startDate AND :endDate
        GROUP BY DATE(created_at)
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
