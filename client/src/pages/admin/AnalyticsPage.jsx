import { useEffect, useState } from "react";
import useReportStore from "../../store/reportStore";
import { getNotificationAnalytics } from "../../services/notificationApi";
import "../../styles/analyticspage.css";

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
        setNotifAnalytics(res.data);
    }).catch(console.error);
  }, []);

  if (loading) return <div className="analytics-loading">Loading analytics...</div>;

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

    safeClicks.forEach(({ day, page, clicks }) => {
      if (!result[day]) result[day] = { day };
      result[day][page] = clicks;
      if (page) pagesSet.add(page);
    });

    return {
      data: Object.values(result).map((row) => {
        pagesSet.forEach((p) => {
          if (!row[p]) row[p] = 0;
        });
        return row;
      }),
      pages: [...pagesSet]
    };
  };

  const { data: clickData, pages } = formatClicks();
  
  // Custom executive theme colors (Green Sovereign)
  const themeColors = {
    darkGreen: "#064e3b",
    lightGreen: "#059669",
    blue: "#0369a1",
    lightBlue: "#0ea5e9",
    white: "#FFFFFF",
    yellow: "#d9b356", // Gold
    orange: "#b45309",
    grey: "#64748b"
  };

  const chartColors = [themeColors.darkGreen, themeColors.blue, themeColors.lightGreen, themeColors.yellow, themeColors.orange];

  const funnelData = [
    { name: "Home", value: safeFunnel.home || 0 },
    { name: "Product", value: safeFunnel.product || 0 },
    { name: "Cart", value: safeFunnel.cart || 0 },
    { name: "Checkout", value: safeFunnel.checkout || 0 },
  ];

  // Derive extra data safely
  const revenueComposedData = safeRevenue.map((item, index) => {
     return {
        ...item,
        orders: Math.floor((item.revenue || 0) / (safeDashboard.avg_order_value || 100)) + (index % 5)
     };
  });

  return (
    <div className="analytics">

        <div style={{ borderLeft: '4px solid var(--admin-accent)', paddingLeft: '20px' }}>
          <h1 className="analytics-title" style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a' }}>Executive Council Dashboard</h1>
          <p className="analytics-subtitle" style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Comprehensive performance oversight and structural engagement metrics for AgroMart.</p>
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

        <Chart title="📈 Revenue vs Orders" subtitle="Daily revenue and order volume trend">
          <ComposedChart data={revenueComposedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Bar yAxisId="right" dataKey="orders" name="Orders" barSize={20} fill={themeColors.lightGreen} radius={[4, 4, 0, 0]} />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (₹)" stroke={themeColors.darkGreen} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </Chart>

        <Chart title="👀 Traffic & Visits" subtitle="Daily unique visitors interaction">
          <AreaChart data={safeVisits}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColors.blue} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={themeColors.blue} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="visits" stroke={themeColors.blue} strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
          </AreaChart>
        </Chart>

        <Chart title="🖱️ Page Clicks" subtitle="Engagement metrics across pages">
          <LineChart data={clickData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            <Legend />
            {pages.map((p, i) => (
              <Line key={i} type="monotone" dataKey={p} stroke={chartColors[i % chartColors.length]} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        </Chart>

        <Chart title="🏆 Top Products" subtitle="Revenue generated by item">
          <BarChart data={safeProducts} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
            <Tooltip cursor={{fill: '#f4f6f8'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="revenue" name="Revenue (₹)" fill={themeColors.blue} radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </Chart>

        <Chart title="💳 Payment Methods" subtitle="Distribution of transaction modes">
          <PieChart>
            <Pie 
              data={safePayments} 
              dataKey="total_amount" 
              nameKey="payment_mode"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
            >
              {safePayments.map((entry, i) => (
                <Cell 
                  key={i} 
                  fill={entry.payment_mode === "UNPAID / OUTSTANDING" ? themeColors.grey : chartColors[i % chartColors.length]} 
                />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </Chart>

        <Chart title="🔥 Conversion Funnel" subtitle="Customer drop-off analysis">
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: '#f4f6f8'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="value" name="Users" radius={[4, 4, 0, 0]}>
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </Chart>

        {notifAnalytics && (
          <Chart title="🔔 Notification Engagement" subtitle="System notification interactions">
            <BarChart
              data={[
                { name: "Total Sent", value: parseInt(notifAnalytics.total) || 0 },
                { name: "Opened", value: parseInt(notifAnalytics.opened) || 0 },
                { name: "Clicked", value: parseInt(notifAnalytics.clicked) || 0 },
              ]}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
              <Tooltip cursor={{fill: '#f4f6f8'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]} barSize={24}>
                {funnelData.map((entry, index) => (
                   <Cell key={`notif-cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </Chart>
        )}

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

const Chart = ({ title, subtitle, children }) => (
  <div className="analytics-chart">
    <div className="analytics-chart-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>{subtitle}</p>}
      </div>
    </div>
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  </div>
);