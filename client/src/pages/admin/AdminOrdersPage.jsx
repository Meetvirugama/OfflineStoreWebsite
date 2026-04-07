import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axiosInstance";
import useToastStore from "../../store/toastStore";
import "../../styles/Admin.css";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToastStore();
    const navigate = useNavigate();

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get("/orders");
            setOrders(res.data);
        } catch (err) {
            addToast("Failed to fetch all orders", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const getStatusBadge = (status) => {
        const s = status?.toUpperCase() || "PENDING";
        let color = "#64748b"; // gray
        let bg = "#f1f5f9";

        if (s === "COMPLETED" || s === "DELIVERED") { color = "#059669"; bg = "#d1fae5"; }
        if (s === "CANCELLED") { color = "#e11d48"; bg = "#ffe4e6"; }
        if (s === "PAID") { color = "#d9b356"; bg = "rgba(217,179,86,0.1)"; } // Executive Gold

        return <span style={{ background: bg, color: color, padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 'bold', border: `1px solid ${color}20` }}>{s}</span>;
    };

    const getPaymentBadge = (order) => {
        const paid = Number(order.paid_amount || 0);
        const final = Number(order.final_amount || 0);
        
        let label = "UNPAID";
        let color = "#e11d48"; // red
        let bg = "#ffe4e6";

        if (paid >= final && final > 0) {
            label = "FULLY PAID";
            color = "#059669"; // green
            bg = "#d1fae5";
        } else if (paid > 0) {
            const pending = (final - paid).toFixed(2);
            label = `PARTIAL (Pending: ₹${pending})`;
            color = "#d97706"; // amber
            bg = "#fef3c7";
        }

        return <span style={{ background: bg, color: color, padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 'bold' }}>{label}</span>;
    };

    const handleSendReminder = async (orderId) => {
        try {
            await api.post(`/notifications/remind/${orderId}`);
            addToast(`Payment reminder dispatched to customer for Order #${orderId} 📧`, "success");
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to send reminder", "error");
        }
    };

    if (loading) return <div className="admin-page">Loading Order Ledger...</div>;

    return (
        <div className="admin-page">
            <div className="admin-actions-bar">
                <div style={{ borderLeft: '4px solid var(--admin-amber)', paddingLeft: '15px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Customer Transactions</h2>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>Full oversight of all AgroMart sales and payment health.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-elite secondary" onClick={fetchAllOrders}>🔄 Refresh Data</button>
                </div>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Customer Name</th>
                        <th>Total Amount</th>
                        <th>Workflow Status</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No orders found in the system.</td></tr>
                    ) : (
                        orders.map(order => (
                            <tr key={order.id}>
                                <td style={{ fontWeight: 600 }}>#{order.id}</td>
                                <td>{order.order_date ? new Date(order.order_date).toLocaleDateString() : "Processing..."}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 800, color: '#0f172a' }}>
                                            {order.Customer?.User?.name || `ID: ${order.customer_id}`}
                                        </span>
                                        <span style={{ fontSize: '11px', color: '#64748b' }}>{order.Customer?.User?.mobile}</span>
                                    </div>
                                </td>
                                <td style={{ fontWeight: 800, color: '#0f172a' }}>₹{Number(order.final_amount || order.total_amount).toFixed(2)}</td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td>{getPaymentBadge(order)}</td>
                                <td>
                                    <div className="table-actions">
                                        <button className="t-btn view" onClick={() => navigate(`/admin/orders/${order.id}`)}>View Ledger</button>
                                        {Number(order.paid_amount || 0) < Number(order.final_amount || 0) && (
                                            <button className="t-btn add" onClick={() => handleSendReminder(order.id)} title="Send Payment Email">📧 Remind</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
