import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Package, 
  ArrowLeft, 
  Download, 
  CreditCard,
  Building,
  MapPin,
  Calendar,
  Printer,
  CheckCircle2,
  X
} from "lucide-react";
import api from "@core/api/client";
import useAuthStore from "@features/auth/store/auth.store";
import useToastStore from "@core/hooks/useToast";
import DynText from "@core/i18n/DynText";
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

// ─── CLIENT-SIDE INVOICE PRINTER ──────────────────────────────────────────
function printInvoice(order, customer) {
  const balance = Number(order.final_amount) - Number(order.paid_amount || 0);
  const isPaid = balance <= 0;
  const date = order.order_date ? new Date(order.order_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "N/A";
  const items = (order.OrderItems || []).map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9">${item.Product?.name || "Product"}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:right">₹${Number(item.price).toFixed(2)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:center">${item.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:700">₹${(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>બીલ — ${order.invoice_number || `ORD-${order.id}`}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; background: #fff; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .brand { font-size: 32px; font-weight: 900; color: #059669; letter-spacing: -1px; }
    .brand-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
    .invoice-meta { text-align: right; }
    .invoice-title { font-size: 22px; font-weight: 900; color: #0f172a; }
    .invoice-ref { font-size: 12px; color: #64748b; margin-top: 6px; }
    .badge { display: inline-block; padding: 4px 14px; border-radius: 100px; font-size: 11px; font-weight: 800; margin-top: 8px; background: ${isPaid ? "#d1fae5" : "#fee2e2"}; color: ${isPaid ? "#065f46" : "#991b1b"}; }
    .divider { border: none; border-top: 2px solid #f1f5f9; margin: 24px 0; }
    .bill-section { display: flex; justify-content: space-between; margin-bottom: 32px; }
    .bill-box h4 { font-size: 11px; font-weight: 800; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }
    .bill-box p { font-size: 14px; line-height: 1.8; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #f8fafc; padding: 12px 0; font-size: 11px; font-weight: 800; color: #64748b; letter-spacing: 1px; text-transform: uppercase; text-align: left; }
    thead th:not(:first-child) { text-align: right; }
    thead th:nth-child(3) { text-align: center; }
    .summary { margin-top: 32px; margin-left: auto; width: 320px; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
    .summary-row.grand { font-size: 18px; font-weight: 900; border-bottom: none; padding-top: 16px; color: #059669; }
    .summary-row.balance { font-weight: 800; color: ${isPaid ? "#059669" : "#b91c1c"}; }
    .stamp { text-align: center; margin: 40px 0; }
    .stamp-text { font-size: 48px; font-weight: 900; color: #059669; opacity: 0.08; letter-spacing: 8px; }
    .footer { margin-top: 48px; border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom:20px;text-align:right">
    <button onclick="window.print()" style="background:#059669;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-weight:800;font-size:14px;cursor:pointer">🖨️ બીલ ડાઉનલોડ કરો</button>
    <button onclick="window.close()" style="background:#f1f5f9;color:#0f172a;border:none;padding:10px 24px;border-radius:8px;font-weight:800;font-size:14px;cursor:pointer;margin-left:8px">✕ બંધ કરો</button>
  </div>
  
  <div class="header">
    <div>
      <div class="brand">🌾 એગ્રોમાર્ટ</div>
      <div class="brand-sub">એક્ઝિક્યુટિવ સોર્સિંગ નેટવર્ક · GSTIN: 24AAACA0000A1Z5</div>
    </div>
    <div class="invoice-meta">
      <div class="invoice-title">ટેક્સ ઇન્વોઇસ</div>
      <div class="invoice-ref">નંબર: ${order.invoice_number || `ORD-${order.id}`}</div>
      <div class="invoice-ref">તારીખ: ${date}</div>
      <div class="badge">${isPaid ? "✓ પેમેન્ટ થઈ ગયું છે" : "⚠ પેમેન્ટ બાકી છે"}</div>
    </div>
  </div>

  <hr class="divider"/>

  <div class="bill-section">
    <div class="bill-box">
      <h4>ગ્રાહકની વિગત</h4>
      <p><strong>${customer?.name || "Verified Customer"}</strong></p>
      <p>${customer?.mobile || ""}</p>
      <p>${customer?.village || "ગુજરાત, ભારત"}</p>
      ${customer?.gst ? `<p>GSTIN: ${customer.gst}</p>` : ""}
    </div>
    <div class="bill-box" style="text-align:right">
      <h4>પેમેન્ટ સ્ટેટસ</h4>
      <p>જમા થયેલ રકમ: <strong style="color:#059669">₹${Number(order.paid_amount || 0).toFixed(2)}</strong></p>
      <p>બાકી રકમ: <strong style="color:${isPaid ? "#059669" : "#b91c1c"}">₹${balance.toFixed(2)}</strong></p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align:left">વસ્તુનું નામ</th>
        <th style="text-align:right">કિંમત</th>
        <th style="text-align:center">નંગ</th>
        <th style="text-align:right">કુલ</th>
      </tr>
    </thead>
    <tbody>${items || '<tr><td colspan="4" style="padding:20px 0;color:#94a3b8">કોઈ વસ્તુ નથી</td></tr>'}</tbody>
  </table>

  <div class="summary">
    <div class="summary-row"><span>કુલ કિંમત</span><span>₹${Number(order.total_amount || 0).toFixed(2)}</span></div>
    ${Number(order.discount || 0) > 0 ? `<div class="summary-row" style="color:#e11d48"><span>ડિસ્કાઉન્ટ</span><span>-₹${Number(order.discount).toFixed(2)}</span></div>` : ""}
    <div class="summary-row"><span>જીએસટી (GST 18%)</span><span>₹${Number(order.gst_total || 0).toFixed(2)}</span></div>
    <div class="summary-row grand"><span>ચુકવવાની રકમ</span><span>₹${Number(order.final_amount || 0).toFixed(2)}</span></div>
    <div class="summary-row balance"><span>બાકી રકમ</span><span>₹${balance.toFixed(2)}</span></div>
  </div>

  ${isPaid ? '<div class="stamp"><div class="stamp-text">પેમેન્ટ પૂર્ણ</div></div>' : ""}

  <div class="footer">
    આ કોમ્પ્યુટર જનરેટેડ ઇન્વોઇસ છે. સહીની જરૂર નથી. · Powered by AgroMart ERP Smart Ledger Technology.
  </div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=700");
  win.document.write(html);
  win.document.close();
}
// ──────────────────────────────────────────────────────────────────────────

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
        // apiClient interceptor returns response.data = { success, message, data: {...} }
        setOrder(res?.data ?? res);
      } catch (err) {
        addToast(<DynText text="Failed to fetch order details" />, "error");
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
        addToast(<DynText text="Razorpay Key is not configured" />, "error");
        return;
      }
      setPaying(true);
      const pendingAmount = Number(order.final_amount) - Number(order.paid_amount || 0);

      const rzpRes = await api.post("/payments/create-order", {
        order_id: order.id,
        amount: pendingAmount
      });

      const rzpOrder = rzpRes?.data?.data ?? rzpRes?.data;
      const sdkLoaded = await loadRazorpaySDK();

      if (!sdkLoaded || !window.Razorpay) {
        addToast(<DynText text="Payment SDK failed to load" />, "error");
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
          addToast(<DynText text="Payment successful!" />, "success");
          window.location.reload();
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        addToast(response.error.description, "error");
      });
      rzp.open();
    } catch (err) {
      addToast(err.message || "Payment failed", "error");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /><DynText text="Loading order data..." /></div>;
  if (!order) return <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}><DynText text="Order not found" /></div>;

  const balance = Number(order.final_amount) - Number(order.paid_amount || 0);

  return (
    <div className="order-details-page container fade-in" style={{ paddingBottom: "60px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link to="/orders" className="back-to-orders">
          <ArrowLeft size={16} strokeWidth={3} /> <DynText text="Back to My Orders" />
        </Link>
      </div>

      <div className="order-grid" style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "32px" }}>
        <div className="order-main">
          <div className="card" style={{ padding: "32px", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0 }}>{order.invoice_number || `Order #${order.id}`}</h1>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}><DynText text="Placed on" /> {new Date(order.order_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <span className={`badge ${order.status === "PAID" ? "badge-success" : "badge-warning"}`} style={{ padding: "8px 16px", borderRadius: "100px", fontSize: "14px", fontWeight: 700 }}>
                <DynText text={order.status} />
              </span>
            </div>

            <div className="order-items-list" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {(order.OrderItems || []).map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px", background: "#f8fafc", borderRadius: "16px" }}>
                  <div style={{ width: "48px", height: "48px", background: "white", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                    <Package size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, margin: 0 }}>{item.Product?.name}</p>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0" }}><DynText text="Qty:" /> {item.quantity} × ₹{Number(item.price).toFixed(2)}</p>
                  </div>
                  <div style={{ fontWeight: 800 }}>
                    ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "40px", borderTop: "1px solid #f1f5f9", paddingTop: "32px" }}>
              <div style={{ maxWidth: "300px", marginLeft: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "var(--text-muted)" }}><DynText text="Subtotal" /></span>
                  <span style={{ fontWeight: 600 }}>₹{Number(order.total_amount).toFixed(2)}</span>
                </div>
                {Number(order.discount || 0) > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#e11d48" }}>
                    <span><DynText text="Discount" /></span>
                    <span style={{ fontWeight: 600 }}>-₹{Number(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "var(--text-muted)" }}><DynText text="Tax (GST 18%)" /></span>
                  <span style={{ fontWeight: 600 }}>₹{Number(order.gst_total || 0).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 800, marginTop: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                  <span><DynText text="Grand Total" /></span>
                  <span style={{ color: "var(--primary)" }}>₹{Number(order.final_amount).toFixed(2)}</span>
                </div>
                {balance <= 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#059669", fontWeight: 700, fontSize: "14px" }}>
                    <CheckCircle2 size={18} /> <DynText text="Fully Paid" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="order-side" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* ACTION CARD */}
          <div className="card" style={{ padding: "24px", borderRadius: "24px", background: "white", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px" }}><DynText text="Order Actions" /></h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {balance > 0 && (
                <button className="btn btn-accent btn-full" onClick={handlePayNow} disabled={paying}>
                  <CreditCard size={18} /> {paying ? <DynText text="Processing..." /> : <><DynText text="Pay Balance (₹" />{balance.toFixed(2)})</>}
                </button>
              )}
              {/* CLIENT-SIDE INVOICE — no backend PDF needed */}
              <button
                className="btn btn-ghost btn-full"
                onClick={() => printInvoice(order, customer)}
                style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                <Printer size={18} /> <DynText text="View & Print Invoice" />
              </button>
            </div>
          </div>

          {/* INFO CARD */}
          <div className="card" style={{ padding: "24px", borderRadius: "24px", background: "#022c22", color: "white" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "#34d399" }}><DynText text="Delivery Details" /></h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <MapPin size={18} style={{ color: "#34d399", flexShrink: 0 }} />
                <p style={{ fontSize: "14px", margin: 0, opacity: 0.9 }}>{customer?.village || "Verified Farm Node"}</p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <Calendar size={18} style={{ color: "#34d399", flexShrink: 0 }} />
                <p style={{ fontSize: "14px", margin: 0, opacity: 0.9 }}><DynText text="Expected within 2–5 business days" /></p>
              </div>
              {customer?.gst && (
                <div style={{ display: "flex", gap: "12px" }}>
                  <Building size={18} style={{ color: "#34d399", flexShrink: 0 }} />
                  <p style={{ fontSize: "14px", margin: 0, opacity: 0.9 }}><DynText text="GST:" /> {customer.gst}</p>
                </div>
              )}
            </div>
          </div>

          {/* PAYMENT STATUS */}
          <div className="card" style={{ padding: "24px", borderRadius: "24px", background: "white", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "20px" }}><DynText text="Payment Status" /></h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-muted)" }}><DynText text="Total Paid" /></span>
                <span style={{ fontWeight: 700, color: "#059669" }}>₹{Number(order.paid_amount || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-muted)" }}><DynText text="Balance Due" /></span>
                <span style={{ fontWeight: 700, color: balance > 0 ? "#e11d48" : "#059669" }}>₹{balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
