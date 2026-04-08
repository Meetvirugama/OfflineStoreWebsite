import sequelize from "../config/db.js";

// ================= DASHBOARD =================
export const getDashboardStats = async () => {
  const [data] = await sequelize.query(`
    SELECT
      COUNT(DISTINCT o.id) AS total_orders,
      COUNT(DISTINCT o.customer_id) AS total_customers,
      ROUND(SUM(o.final_amount)::numeric,2) AS total_revenue,
      ROUND(AVG(o.final_amount)::numeric,2) AS avg_order_value
    FROM orders o
  `);
  return data[0];
};

// ================= REVENUE =================
export const getRevenueTrend = async () => {
  const [data] = await sequelize.query(`
    SELECT
      DATE(order_date) AS day,
      ROUND(SUM(final_amount)::numeric,2) AS revenue,
      LAG(SUM(final_amount)) OVER (ORDER BY DATE(order_date)) AS prev_day,
      ROUND(
        ((SUM(final_amount) - LAG(SUM(final_amount)) OVER (ORDER BY DATE(order_date)))
        / NULLIF(LAG(SUM(final_amount)) OVER (ORDER BY DATE(order_date)),0) * 100)::numeric, 2
      ) AS growth_percent
    FROM orders
    GROUP BY day
    ORDER BY day ASC
  `);
  return data;
};

export const getMonthlyRevenue = async () => {
  const [data] = await sequelize.query(`
    SELECT
      TO_CHAR(order_date, 'YYYY-MM') AS month,
      ROUND(SUM(final_amount)::numeric,2) AS revenue
    FROM orders
    GROUP BY month
    ORDER BY month
  `);
  return data;
};

// ================= PRODUCTS =================
export const getTopProductsAdvanced = async () => {
  const [data] = await sequelize.query(`
    SELECT
      p.name,
      SUM(oi.quantity) AS units_sold,
      ROUND(SUM(oi.total)::numeric,2) AS revenue,
      ROUND(SUM(oi.quantity * (p.selling_price - COALESCE(p.cost_price,0)))::numeric,2) AS profit,
      ROUND(
        ((SUM(oi.quantity * (p.selling_price - COALESCE(p.cost_price,0)))
        / NULLIF(SUM(oi.total),0)) * 100)::numeric, 2
      ) AS profit_margin
    FROM order_item oi
    JOIN product p ON oi.product_id = p.id
    GROUP BY p.name
    ORDER BY revenue DESC
    LIMIT 10
  `);
  return data;
};

export const getTopCategories = async () => {
  const [data] = await sequelize.query(`
    SELECT
      p.category,
      ROUND(SUM(oi.total)::numeric,2) AS revenue
    FROM order_item oi
    JOIN product p ON oi.product_id = p.id
    GROUP BY p.category
    ORDER BY revenue DESC
  `);
  return data;
};

// ================= CUSTOMER =================
export const getCustomerCLV = async () => {
  const [data] = await sequelize.query(`
    SELECT
      c.name,
      c.mobile,
      COUNT(o.id) AS total_orders,
      ROUND(SUM(o.final_amount)::numeric,2) AS lifetime_value,
      ROUND(AVG(o.final_amount)::numeric,2) AS avg_order_value
    FROM customer c
    JOIN orders o ON o.customer_id = c.id
    GROUP BY c.id
    ORDER BY lifetime_value DESC
    LIMIT 10
  `);
  return data;
};

export const getCustomerTypeAnalysis = async () => {
  const [data] = await sequelize.query(`
    SELECT
      CASE
        WHEN order_count = 1 THEN 'NEW'
        ELSE 'REPEAT'
      END AS customer_type,
      COUNT(*) AS total_customers
    FROM (
      SELECT customer_id, COUNT(*) AS order_count
      FROM orders
      GROUP BY customer_id
    ) t
    GROUP BY customer_type
  `);
  return data;
};

export const getCustomerSegments = async () => {
  const [data] = await sequelize.query(`
    SELECT
      CASE
        WHEN total_spent > 10000 THEN 'HIGH'
        WHEN total_spent > 5000 THEN 'MEDIUM'
        ELSE 'LOW'
      END AS segment,
      COUNT(*) AS customers
    FROM (
      SELECT c.id, SUM(o.final_amount) AS total_spent
      FROM customer c
      JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id
    ) t
    GROUP BY segment
  `);
  return data;
};

export const getRepeatRate = async () => {
  const [data] = await sequelize.query(`
    SELECT
      ROUND(
        (COUNT(*) FILTER (WHERE order_count > 1)::decimal /
        COUNT(*) * 100)::numeric, 2
      ) AS repeat_rate
    FROM (
      SELECT customer_id, COUNT(*) AS order_count
      FROM orders
      GROUP BY customer_id
    ) t
  `);
  return data[0];
};

// ================= PAYMENTS =================
export const getPaymentAnalysis = async () => {
    // 1. Get Actual Payments from Payment table
    const [payments] = await sequelize.query(`
        SELECT
            payment_mode,
            COUNT(*) AS transactions,
            ROUND(SUM(amount)::numeric,2) AS total_amount
        FROM payment
        GROUP BY payment_mode
    `);

    // 2. Get Total Revenue from Orders table
    const [revenueData] = await sequelize.query(`
        SELECT ROUND(SUM(final_amount)::numeric,2) AS total_revenue FROM orders
    `);
    const totalRevenue = parseFloat(revenueData[0].total_revenue || 0);

    // 3. Calculate Collected Total
    const totalCollected = payments.reduce((sum, p) => sum + parseFloat(p.total_amount), 0);

    // 4. Calculate Gap (Unpaid Balance)
    const unpaidBalance = Math.max(0, totalRevenue - totalCollected);

    // 5. Append UNPAID slice for balance
    if (unpaidBalance > 0.01) {
        payments.push({
            payment_mode: "UNPAID / OUTSTANDING",
            transactions: 0,
            total_amount: unpaidBalance.toFixed(2)
        });
    }

    return payments.sort((a, b) => b.total_amount - a.total_amount);
};

// ================= ANALYTICS =================
export const getDailyVisits = async () => {
  try {
    const [data] = await sequelize.query(`
      SELECT
        DATE(created_at) AS day,
        COUNT(*) AS visits
      FROM analytics
      WHERE type = 'VISIT'
      GROUP BY day
      ORDER BY day
    `);
    return data;
  } catch (err) {
    console.warn("⚠️ Analytics (Visits) unavailable:", err.message);
    return [];
  }
};

export const getClicksPerDayPerPage = async () => {
  try {
    const [data] = await sequelize.query(`
      SELECT
        DATE(created_at) AS day,
        page,
        COUNT(*) AS clicks
      FROM analytics
      WHERE type = 'CLICK'
      GROUP BY day, page
      ORDER BY day, clicks DESC
    `);
    return data;
  } catch (err) {
    console.warn("⚠️ Analytics (Clicks) unavailable:", err.message);
    return [];
  }
};

export const getHourlyTraffic = async () => {
  try {
    const [data] = await sequelize.query(`
      SELECT
        EXTRACT(HOUR FROM created_at) AS hour,
        COUNT(*) AS visits
      FROM analytics
      WHERE type='VISIT'
      GROUP BY hour
      ORDER BY hour
    `);
    return data;
  } catch (err) {
    console.warn("⚠️ Analytics (Traffic) unavailable:", err.message);
    return [];
  }
};

export const getFunnel = async () => {
  try {
    const [data] = await sequelize.query(`
      SELECT
        SUM(CASE WHEN page = '/' THEN 1 ELSE 0 END) AS home,
        SUM(CASE WHEN page LIKE '/product%' THEN 1 ELSE 0 END) AS product,
        SUM(CASE WHEN page = '/cart' THEN 1 ELSE 0 END) AS cart,
        SUM(CASE WHEN page = '/checkout' THEN 1 ELSE 0 END) AS checkout
      FROM analytics
      WHERE type = 'CLICK'
    `);
    return data[0];
  } catch (err) {
    console.warn("⚠️ Analytics (Funnel) unavailable:", err.message);
    return { home: 0, product: 0, cart: 0, checkout: 0 };
  }
};

export const getConversionRate = async () => {
  try {
    const [data] = await sequelize.query(`
      SELECT
        (SELECT COUNT(*) FROM orders) AS total_orders,
        (SELECT COUNT(*) FROM analytics WHERE type='VISIT') AS total_visits,
        ROUND(
          ((SELECT COUNT(*) FROM orders)::decimal /
          NULLIF((SELECT COUNT(*) FROM analytics WHERE type='VISIT'),0) * 100)::numeric,
        2) AS conversion_rate
    `);
    return data[0];
  } catch (err) {
    console.warn("⚠️ Analytics (Conversion) unavailable:", err.message);
    return { total_orders: 0, total_visits: 0, conversion_rate: 0 };
  }
};

// ================= EXTRA =================
export const getTopSalesDays = async () => {
  const [data] = await sequelize.query(`
    SELECT
      DATE(order_date) AS day,
      ROUND(SUM(final_amount)::numeric,2) AS revenue
    FROM orders
    GROUP BY day
    ORDER BY revenue DESC
    LIMIT 10
  `);
  return data;
};

export const getLowStockProducts = async () => {
  const [data] = await sequelize.query(`
    SELECT
      p.name,
      SUM(i.quantity_change) AS stock
    FROM product p
    JOIN inventory i ON p.id = i.product_id
    GROUP BY p.id
    HAVING SUM(i.quantity_change) < 20
    ORDER BY stock ASC
  `);
  return data;
};