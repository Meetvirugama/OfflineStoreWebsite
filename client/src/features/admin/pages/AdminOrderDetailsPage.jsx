import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@core/api/client";
import useToastStore from "@core/hooks/useToast";
import Modal from "@core/components/Modal";
import "@/styles/Admin.css";

export default function AdminOrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToastStore();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sendingReminder, setSendingReminder] = useState(false);
    const [showSettlementModal, setShowSettlementModal] = useState(false);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data);
        } catch (err) {
            addToast("Failed to fetch order details", "error");
            navigate("/admin/orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const handleMarkAsPaid = async () => {
        const amount = Number(order.final_amount) - Number(order.paid_amount || 0);
        if (amount <= 0) return;

        try {
            await api.post("/payments", {
                order_id: order.id,
                amount: amount,
                payment_mode: "CASH"
            });
            addToast("Order marked as PAID via Cash!", "success");
            setShowSettlementModal(false);
            fetchOrderDetails();
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to mark as paid", "error");
        }
    };

    const handleSendReminder = async () => {
        try {
            setSendingReminder(true);
            await api.post(`/notifications/remind/${id}`);
            addToast("Payment reminder dispatched successfully! 📧", "success");
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to send reminder", "error");
        } finally {
            setSendingReminder(false);
        }
    };

    if (loading) return <div className="admin-page">Loading Transaction Record...</div>;
    if (!order) return <div className="admin-page">Order not found.</div>;

    const isUnpaid = Number(order.paid_amount || 0) < Number(order.final_amount || 0);

    return (
        <div className="admin-page">
            <div className="admin-actions-bar">
                <div style={{ borderLeft: '4px solid var(--admin-amber)', paddingLeft: '15px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Transaction Ledger #{order.id}</h2>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>Technical breakdown of customer acquisition and payment health.</p>
                </div>
                <button className="btn-elite secondary" onClick={() => navigate("/admin/orders")}>← Back to Ledger</button>
            </div>

            <div className="admin-profile-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
                
                {/* ORDER CONTENT */}
                <div className="elite-card" style={{ background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', marginBottom: '20px' }}>Items & Procurement</h3>
                    <table className="admin-table" style={{ boxShadow: 'none', border: 'none' }}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Unit Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.OrderItems || []).map((item, idx) => (
                                <tr key={idx}>
                                    <td style={{ fontWeight: 600 }}>{item.Product?.name || `Product ID: ${item.product_id}`}</td>
                                    <td>₹{Number(item.price).toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        {/* LEFT SIDE: SMART INSIGHTS & PAYMENT GAUGE */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '320px' }}>
                            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#059669', borderRadius: '4px 0 0 4px' }} />
                                
                                <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    📊 Payment Health Index
                                </h4>
                                
                                {/* Progress Bar */}
                                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                                    <div style={{ 
                                        width: `${Math.min(100, Math.round((Number(order.paid_amount || 0) / Number(order.final_amount || 1)) * 100))}%`, 
                                        height: '100%', 
                                        background: 'linear-gradient(90deg, #10b981, #059669)', 
                                        borderRadius: '10px',
                                        transition: 'width 1s ease-in-out'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                                    <span style={{ color: '#64748b' }}>Fulfillment Progress</span>
                                    <span style={{ color: '#059669' }}>
                                        {Math.min(100, Math.round((Number(order.paid_amount || 0) / Number(order.final_amount || 1)) * 100))}%
                                    </span>
                                </div>
                            </div>

                            {/* Digital Stamp / Barcode */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(5, 150, 105, 0.04)', borderRadius: '12px', border: '1px dashed rgba(5, 150, 105, 0.3)' }}>
                                <div style={{ display: 'flex', gap: '3px', height: '35px', alignItems: 'center' }}>
                                    {[2, 4, 1.5, 6, 2, 3, 5, 2, 4, 3, 1.5, 2, 4].map((width, i) => (
                                        <div key={i} style={{ width: `${width}px`, height: '100%', background: '#0f172a', opacity: 0.8, borderRadius: '1px' }}></div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', letterSpacing: '1px', textTransform: 'uppercase' }}>Verified Entry</span>
                                    <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>{order.invoice_number || `TXN-${order.id}-9982`}</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE: SUMMARY */}
                        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <SummaryRow label="Subtotal" value={`₹${Number(order.total_amount).toFixed(2)}`} />
                            <SummaryRow label="GST (CGST+SGST)" value={`₹${Number(order.gst_total).toFixed(2)}`} />
                            <SummaryRow label="Discount" value={`-₹${Number(order.discount).toFixed(2)}`} color="#e11d48" />
                            <div style={{ height: '1px', background: '#e2e8f0', margin: '5px 0' }} />
                            <SummaryRow label="Final Amount" value={`₹${Number(order.final_amount).toFixed(2)}`} bold size="17px" />
                            
                            {/* 🔥 PAYMENT BREAKDOWN */}
                            <div style={{ height: '1px', background: '#e2e8f0', margin: '5px 0' }} />
                            <SummaryRow label="Total Paid" value={`₹${Number(order.paid_amount || 0).toFixed(2)}`} color="#059669" />
                            <SummaryRow label="Balance Due" value={`₹${(Number(order.final_amount) - Number(order.paid_amount || 0)).toFixed(2)}`} color="#e11d48" bold />
                        </div>
                    </div>
                </div>

                {/* CUSTOMER & PAYMENT SIDEBAR */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div className="elite-card" style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '15px' }}>Management Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <InfoPill label="Workflow" value={order.status} />
                            <InfoPill label="Payment" value={isUnpaid ? "OUTSTANDING" : "SETTLED"} color={isUnpaid ? "#e11d48" : "#059669"} />
                            <InfoPill label="Date" value={new Date(order.order_date).toLocaleDateString()} />
                        </div>
                        
                        {isUnpaid && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                                <button 
                                    className="btn-elite primary" 
                                    style={{ width: '100%', background: 'var(--admin-amber)', boxShadow: 'none' }}
                                    onClick={handleSendReminder}
                                    disabled={sendingReminder}
                                >
                                    {sendingReminder ? "⌛ Sending..." : "📧 Dispatch Reminder"}
                                </button>
                                <button 
                                    className="btn-elite secondary" 
                                    style={{ width: '100%', background: '#059669', color: 'white', border: 'none', boxShadow: 'none' }}
                                    onClick={() => setShowSettlementModal(true)}
                                >
                                    💰 Mark as Settled (Cash)
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="elite-card" style={{ background: '#0f172a', padding: '25px', borderRadius: '20px', color: 'white' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '15px', color: 'var(--admin-amber)' }}>Acquisition Details</h3>
                        <p style={{ fontSize: '13px', margin: '0 0 5px 0', opacity: 0.7 }}>Customer Reference</p>
                        <p style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 15px 0' }}>ID: {order.customer_id}</p>
                        
                        <p style={{ fontSize: '13px', margin: '0 0 5px 0', opacity: 0.7 }}>Billing Address</p>
                        <p style={{ fontSize: '14px', lineHeight: '1.5' }}>Verified System Address<br />AgroMart Registered Node</p>
                    </div>
                </div>
            </div>

            {/* 🧾 SETTLEMENT MODAL */}
            <Modal 
                isOpen={showSettlementModal}
                onClose={() => setShowSettlementModal(false)}
                onConfirm={handleMarkAsPaid}
                title="Confirm Cash Settlement"
                amount={(Number(order.final_amount) - Number(order.paid_amount || 0)).toFixed(2)}
                message={`Are you sure you want to settle the balance for Order #${order.id} into the system ledger?`}
                confirmText="Settle Now 💰"
                cancelText="Not Yet"
            />
        </div>
    );
}

function SummaryRow({ label, value, color = "#0f172a", bold = false, size = "14px" }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: size, fontWeight: bold ? 800 : 600, color }}>{value}</span>
        </div>
    );
}

function InfoPill({ label, value, color = "#475569" }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: '#f8fafc', borderRadius: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{label}</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color }}>{value}</span>
        </div>
    );
}
