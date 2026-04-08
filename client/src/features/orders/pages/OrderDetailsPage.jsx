import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Package, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download, 
  CreditCard,
  Building,
  MapPin,
  Calendar
} from "lucide-react";
import api from "@core/api/client";
import useAuthStore from "@features/auth/store/auth.store";
import useToastStore from "@core/hooks/useToast";
import "@/styles/OrdersPage.css";

// ✅ Dynamically load Razorpay SDK
const loadRazorpaySDK = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customer } = useAuthStore();
  const { addToast } = useToastStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        addToast("Failed to fetch order details", "error");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate, addToast]);

  const handlePayNow = async () => {
    try {
      if (!import.meta.env.VITE_RAZORPAY_KEY) {
        addToast("Razorpay Key is not configured in client/.env", "error");
        return;
      }
      setPaying(true);
      const pendingAmount = Number(order.final_amount) - Number(order.paid_amount || 0);

      const rzpRes = await api.post("/payments/create-order", {
        order_id: order.id,
        amount: pendingAmount
      });

      const rzpOrder = rzpRes.data?.data;
      const sdkLoaded = await loadRazorpaySDK();

      if (!sdkLoaded || !window.Razorpay) {
        addToast("Payment SDK failed to load", "error");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: rzpOrder.amount,
        currency: "INR",
        order_id: rzpOrder.id,
        name: "AgroMart",
        description: `Ref: ${order.invoice_number || order.id}`,
        prefill: {
          name: customer?.name || "",
          contact: customer?.mobile || "",
        },
        theme: { color: "#059669" },
        handler: async (response) => {
          await api.post("/payments/verify", {
            ...response,
            order_id: order.id,
            amount: pendingAmount
          });
          addToast("Payment successful!", "success");
          window.location.reload();
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        addToast(response.error.description, "error");
      });
      rzp.open();
    } catch (err) {
      addToast(err.message || "Payment failed", "error");
    } finally {
      setPaying(false);
    }
  };

  const downloadInvoice = async () => {
    try {
      const response = await api.get(`/invoice/${id}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${order.invoice_number || id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      addToast("Invoice not available yet", "info");
    }
  };

  if (loading) return <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;
  if (!order) return <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}>Order not found</div>;

  const balance = Number(order.final_amount) - Number(order.paid_amount || 0);

  return (
    <div className="order-details-page container fade-in" style={{ paddingBottom: "60px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link to="/orders" className="back-to-orders">
          <ArrowLeft size={16} strokeWidth={3} /> Back to My Orders
        </Link>
      </div>

      <div className="order-grid" style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "32px" }}>
        <div className="order-main">
          <div className="card" style={{ padding: "32px", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0 }}>{order.invoice_number || `Order #${order.id}`}</h1>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Placed on {new Date(order.order_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <span className={`badge ${order.status === "PAID" ? "badge-success" : "badge-warning"}`} style={{ padding: "8px 16px", borderRadius: "100px", fontSize: "14px", fontWeight: 700 }}>
                {order.status}
              </span>
            </div>

            <div className="order-items-list" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {order.items?.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px", background: "#f8fafc", borderRadius: "16px" }}>
                  <div style={{ width: "48px", height: "48px", background: "white", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                    <Package size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, margin: 0 }}>{item.Product?.name}</p>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0" }}>Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</p>
                  </div>
                  <div style={{ fontWeight: 800 }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "40px", borderTop: "1px solid #f1f5f9", paddingTop: "32px" }}>
              <div style={{ maxWidth: "300px", marginLeft: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₹{Number(order.total_amount).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#e11d48" }}>
                    <span>Discount</span>
                    <span style={{ fontWeight: 600 }}>-₹{Number(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Tax (GST)</span>
                  <span style={{ fontWeight: 600 }}>₹{Number(order.gst_total).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 800, marginTop: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                  <span>Grand Total</span>
                  <span style={{ color: "var(--primary)" }}>₹{Number(order.final_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-side" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* ACTION CARD */}
          <div className="card" style={{ padding: "24px", borderRadius: "24px", background: "white", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px" }}>Order Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {balance > 0 && (
                <button className="btn btn-accent btn-full" onClick={handlePayNow} disabled={paying}>
                  <CreditCard size={18} /> {paying ? "Processing..." : `Pay Balance (₹${balance.toFixed(2)})`}
                </button>
              )}
              <button className="btn btn-ghost btn-full" onClick={downloadInvoice}>
                <Download size={18} /> Download Invoice
              </button>
            </div>
          </div>

          {/* INFO CARD */}
          <div className="card" style={{ padding: "24px", borderRadius: "24px", background: "#022c22", color: "white" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "#34d399" }}>Delivery Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <MapPin size={18} style={{ color: "#34d399", shrink: 0 }} />
                <p style={{ fontSize: "14px", margin: 0, opacity: 0.9 }}>{customer?.village || "Verified Farm Node"}</p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <Calendar size={18} style={{ color: "#34d399", shrink: 0 }} />
                <p style={{ fontSize: "14px", margin: 0, opacity: 0.9 }}>Expected within 2-5 days</p>
              </div>
              {customer?.gst && (
                <div style={{ display: "flex", gap: "12px" }}>
                  <Building size={18} style={{ color: "#34d399", shrink: 0 }} />
                  <p style={{ fontSize: "14px", margin: 0, opacity: 0.9 }}>GST: {customer.gst}</p>
                </div>
              )}
            </div>
          </div>

          {/* STATUS TIMELINE */}
          <div className="card" style={{ padding: "24px", borderRadius: "24px", background: "white", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "20px" }}>Payment Status</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-muted)" }}>Total Paid</span>
                <span style={{ fontWeight: 700, color: "#059669" }}>₹{Number(order.paid_amount || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-muted)" }}>Balance Due</span>
                <span style={{ fontWeight: 700, color: balance > 0 ? "#e11d48" : "#059669" }}>₹{balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
