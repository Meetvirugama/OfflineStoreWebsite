import { useEffect, useState } from "react";
import useReportStore from "@features/admin/store/report.store";
import AgroLoader from "@core/components/AgroLoader";
import { getNotificationAnalytics } from "@features/notifications/api/notification.service";
import "@/styles/analyticspage.css";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Legend
} from "recharts";

export default function AnalyticsPage() {
  const {
    dashboard,
    revenue,
    visits,
    clicks,
    payments,
    products,
    funnel,
    conversion,
    fetchReports,
    loading
  } = useReportStore();

  const [notifAnalytics, setNotifAnalytics] = useState(null);

  useEffect(() => {
    fetchReports();
    getNotificationAnalytics().then(res => {
        setNotifAnalytics(res);
    }).catch(console.error);
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', width: '100%' }}>
      <AgroLoader text="Compiling Executive Reports..." />
    </div>
  );

  // Defensive defaults to prevent crashes on initial render or missing data
  const safeDashboard = dashboard || {};
  const safeRevenue = Array.isArray(revenue) ? revenue : [];
  const safeVisits = Array.isArray(visits) ? visits : [];
  const safeClicks = Array.isArray(clicks) ? clicks : [];
  const safePayments = Array.isArray(payments) ? payments.map(p => ({ ...p, total_amount: parseFloat(p.total_amount) || 0 })) : [];
  const safeProducts = Array.isArray(products) ? products.map(p => ({ ...p, revenue: parseFloat(p.revenue) || 0, profit: parseFloat(p.profit) || 0 })) : [];
  const safeFunnel = funnel || {};
  const safeConversion = conversion || {};

  // ===== CLICK FIX =====
  const formatClicks = () => {
    const result = {};
    const pagesSet = new Set();

    safeClicks.forEach(({ day, page, clicks: clickCount }) => {
      if (!result[day]) result[day] = { day };
      // Normalize page names for legend
      const pageLabel = page ? page.replace("/", "").toUpperCase() || "HOME" : "OTHER";
      result[day][pageLabel] = (result[day][pageLabel] || 0) + parseInt(clickCount);
      pagesSet.add(pageLabel);
    });

    return {
      data: Object.values(result).sort((a,b) => new Date(a.day) - new Date(b.day)),
      pages: [...pagesSet]
    };
  };

  const { data: clickData, pages } = formatClicks();
  
  // Custom executive theme colors (Green Sovereign)
  const themeColors = {
    darkGreen: "#064e3b",
    lightGreen: "#10b981",
    blue: "#0369a1",
    lightBlue: "#0ea5e9",
    white: "#FFFFFF",
    yellow: "#d9b356", // Gold
    orange: "#b45309",
    grey: "#64748b"
  };

  const chartColors = [themeColors.blue, themeColors.lightGreen, themeColors.orange, themeColors.yellow, themeColors.grey];

  const funnelData = [
    { name: "Home", value: safeFunnel.home || 0 },
    { name: "Product", value: safeFunnel.product || 0 },
    { name: "Cart", value: safeFunnel.cart || 0 },
    { name: "Checkout", value: safeFunnel.checkout || 0 },
  ];

  // Derive extra data safely
  const revenueComposedData = safeRevenue.map((item) => {
     return {
        ...item,
        // Use real orders if available, otherwise 0
        orders: parseInt(item.orders) || 0,
        revenue: parseFloat(item.revenue) || 0
     };
  });

  return (
    <div className="analytics">

        <div style={{ borderLeft: '4px solid var(--admin-accent)', paddingLeft: '20px' }}>
          <h1 className="analytics-title" style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a' }}>Executive Council Dashboard</h1>
          <p className="analytics-subtitle" style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Comprehensive performance oversight and structural engagement metrics for AgroPlatform.</p>
        </div>

      {/* KPI */}
      <div className="analytics-cards">
        <Card title="Total Revenue" value={`₹${safeDashboard.total_revenue || 0}`} type="green"/>
        <Card title="Total Orders" value={safeDashboard.total_orders || 0} type="blue"/>
        <Card title="Total Customers" value={safeDashboard.total_customers || 0} type="light-green"/>
        <Card title="Avg Order Value" value={`₹${safeDashboard.avg_order_value || 0}`} type="white"/>
        <Card title="Conversion Rate" value={`${safeConversion.conversion_rate || 0}%`} type="yellow"/>
      </div>

      {/* GRID */}
      <div className="analytics-grid">

        {/* HERO CHART: FULL WIDTH */}
        <div className="analytics-hero">
          <Chart title="Revenue Performance" subtitle="Daily revenue (Line) and order volume (Bars)" isEmpty={safeRevenue.length === 0}>
            <ComposedChart data={revenueComposedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} domain={[0, 'auto']} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
              <Legend verticalAlign="top" align="right" height={36}/>
              <Bar yAxisId="right" dataKey="orders" name="Orders" barSize={35} fill={themeColors.blue} radius={[6, 6, 0, 0]} opacity={0.8} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (₹)" stroke={themeColors.lightGreen} strokeWidth={5} dot={{ r: 6, fill: themeColors.lightGreen, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
            </ComposedChart>
          </Chart>
        </div>

        <Chart title="Customer Traffic" subtitle="Daily unique visitors interaction" isEmpty={safeVisits.length === 0}>
          <AreaChart data={safeVisits} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColors.blue} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={themeColors.blue} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="day" axisLine={false} tickLine={false} hide />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
            <Area type="monotone" dataKey="visits" name="Visits" stroke={themeColors.blue} strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
          </AreaChart>
        </Chart>

        <Chart title="Engagement Metrics" subtitle="Click velocity across nodes" isEmpty={clickData.length === 0}>
          <LineChart data={clickData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="day" hide />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
            <Legend iconType="circle" />
            {pages.map((p, i) => (
              <Line key={i} type="monotone" dataKey={p} stroke={chartColors[i % chartColors.length]} strokeWidth={3} dot={false} />
            ))}
          </LineChart>
        </Chart>

        <Chart title="Top Performing Products" subtitle="Revenue generated by item" isEmpty={safeProducts.length === 0}>
          <BarChart data={safeProducts} layout="vertical" margin={{ left: 10, right: 30 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} style={{ fontSize: '11px', fontWeight: '600' }} />
            <Tooltip cursor={{fill: 'rgba(0,0,0,0.03)'}} />
            <Bar dataKey="revenue" name="Revenue (₹)" fill={themeColors.lightGreen} radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </Chart>

        <Chart title="Revenue Distribution" subtitle="Payment method settlement" isEmpty={safePayments.length === 0}>
          <PieChart>
            <Pie 
              data={safePayments} 
              dataKey="total_amount" 
              nameKey="payment_mode"
              cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5}
            >
              {safePayments.map((entry, i) => (
                <Cell key={i} fill={entry.payment_mode === "UNPAID / OUTSTANDING" ? themeColors.grey : chartColors[i % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" align="center" iconType="circle" />
          </PieChart>
        </Chart>

        <Chart title="Sales Pipeline" subtitle="Conversion drop-off" isEmpty={!Object.values(safeFunnel).some(v => v > 0)}>
          <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: 'rgba(0,0,0,0.03)'}} />
            <Bar dataKey="value" name="Users" radius={[6, 6, 0, 0]} barSize={40}>
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </Chart>

        {notifAnalytics && (
          <Chart title="Notification Insights" subtitle="Interactions telemetry">
            <BarChart
              data={[
                { name: "Sent", value: parseInt(notifAnalytics.total) || 0 },
                { name: "Opened", value: parseInt(notifAnalytics.opened) || 0 },
                { name: "Clicked", value: parseInt(notifAnalytics.clicked) || 0 },
              ]}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
              <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]} barSize={20} fill={themeColors.blue} />
            </BarChart>
          </Chart>
        )}

      </div>

      <div style={{ marginTop: '5rem', borderLeft: '5px solid #10b981', paddingLeft: '24px', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#064e3b', letterSpacing: '-0.5px' }}>🌿 Agriculture Intelligence Node</h2>
          <p style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Live market price trends and structural commodity demand insights.</p>
      </div>

      <div className="analytics-grid">
          {/* MAJOR AGRI CHART */}
          <div className="analytics-hero">
            <Chart title="Global Price Trend" subtitle="Daily average modal price (last 7 days)">
              <AreaChart data={safeDashboard.agriInsights?.trends || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                      <linearGradient id="colorAgri" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d9b356" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#d9b356" stopOpacity={0}/>
                      </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} dy={10} />
                  <YAxis axisLine={false} tickLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                  <Area type="monotone" dataKey="avg_price" name="Avg Price" stroke="#d9b356" strokeWidth={4} fillOpacity={1} fill="url(#colorAgri)" />
              </AreaChart>
            </Chart>
          </div>

          <Chart title="Top Crops by Volume" subtitle="Traded commodities">
            <BarChart data={safeDashboard.agriInsights?.topCrops || []}>
                <XAxis dataKey="commodity" hide />
                <YAxis hide />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.03)'}} />
                <Bar dataKey="volume" name="Volume" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </Chart>

          <Chart title="Category Demand" subtitle="Consumer movement insights">
            <PieChart>
                <Pie 
                    data={safeDashboard.agriInsights?.demand || []} 
                    dataKey="movement" 
                    nameKey="category"
                    cx="50%" cy="50%" outerRadius={80}
                >
                    { (safeDashboard.agriInsights?.demand || []).map((entry, i) => (
                        <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
            </PieChart>
          </Chart>
      </div>

    </div>
  );
}

const Card = ({ title, value, type }) => (
  <div className={`analytics-card analytics-${type}`}>
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const Chart = ({ title, subtitle, children, isEmpty }) => (
  <div className="analytics-chart">
    <div className="analytics-chart-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>{subtitle}</p>}
      </div>
    </div>
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      {isEmpty && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(2px)',
          zIndex: 10,
          borderRadius: '12px'
        }}>
          <p style={{ color: '#64748b', fontWeight: '600' }}>Waiting for fresh analytics data...</p>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);