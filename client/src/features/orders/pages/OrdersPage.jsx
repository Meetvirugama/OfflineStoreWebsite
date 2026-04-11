import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, CreditCard, FileText, CheckCircle, Clock, AlertCircle, Download } from "lucide-react";
import api from "@core/api/client";
import useAuthStore from "@features/auth/store/auth.store";
import useToastStore from "@core/hooks/useToast";
import "@/styles/OrdersPage.css";

// ✅ Dynamically load Razorpay SDK if not already present
const loadRazorpaySDK = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function OrdersPage() {
  const { customer } = useAuthStore();
  const { addToast } = useToastStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState(null);

  useEffect(() => {
    document.title = "My Orders – AgroMart";
    fetchOrders();
  }, [customer?.id]);

  const fetchOrders = async () => {
    if (!customer?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/orders?customer_id=${customer.id}`);
      setOrders(Array.isArray(res) ? res : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ PAY NOW – for PENDING/PARTIAL orders
  const handlePayNow = async (order) => {
    try {
      setPayingOrderId(order.id);

      const pendingAmount = Number(order.final_amount) - Number(order.paid_amount || 0);

      if (pendingAmount <= 0) {
        addToast("Order already fully paid!", "info");
        return;
      }

      // Create Razorpay order
      const rzpRes = await api.post("/payments/create-order", {
        order_id: order.id,
        amount: pendingAmount
      });

      const rzpOrder = rzpRes;

      if (!rzpOrder?.id) {
        addToast("Failed to create payment order", "error");
        return;
      }

      // ✅ Ensure SDK is loaded before opening modal
      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded || !window.Razorpay) {
        addToast("Payment SDK failed to load. Please refresh and try again.", "error");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: rzpOrder.amount,
        currency: "INR",
        order_id: rzpOrder.id,
        name: "AgroMart",
        description: `Payment for Order #${order.id}`,
        prefill: {
          name: customer?.name || "Customer",
          contact: customer?.mobile || "",
          email: customer?.email || ""
        },
        theme: { color: "#059669" },

        handler: async (response) => {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id,
              amount: pendingAmount
            });

            addToast("Payment successful!", "success");
            fetchOrders(); // Refresh orders list

          } catch (err) {
            console.error("Payment verification failed:", err);
            addToast("Payment verification failed", "error");
          }
        },

        modal: {
          ondismiss: () => {
            addToast("Payment cancelled", "info");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => addToast("Payment failed", "error"));
      rzp.open();

    } catch (err) {
      console.error("Pay Now Error:", err);
      addToast(err.message || "Payment failed", "error");
    } finally {
      setPayingOrderId(null);
    }
  };

  // ✅ DOWNLOAD INVOICE — with auth token
  const downloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/invoice/${orderId}`, {
        responseType: "blob"
      });

      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      addToast(
        err.response?.status === 404
          ? "Invoice not generated yet"
          : "Failed to download invoice",
        "error"
      );
    }
  };

  const statusColor = (status) => {
    if (status === "PAID") return "badge-success";
    if (status === "PARTIAL") return "badge-warning";
    return "badge-primary";
  };

  const getStatusIcon = (status) => {
    if (status === "PAID") return <CheckCircle size={14} />;
    if (status === "PARTIAL") return <Clock size={14} />;
    return <AlertCircle size={14} />;
  };

  return (
    <div className="orders-page container fade-in">
      <header className="orders-page__header">
        <h1 className="orders-page__title">My Orders</h1>
        <p className="orders-page__subtitle">Track and manage your recent purchases</p>
      </header>

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state fade-in">
          <div className="empty-illustration">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="3" fill="#f1f5f9" />
              <path d="M8 8H16M8 12H16M8 16H12" stroke="url(#grad-amber-orders)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="18" cy="18" r="4" fill="#059669" />
              <path d="M16 18l1.5 1.5L20 16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="grad-amber-orders" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#d97706" />
                  <stop offset="1" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h3>Your order book is clear</h3>
          <p>Ready to start your first sourcing journey?</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card card">
              <div className="order-card__header">
                <div className="order-card__id-date">
                  <div className="order-card__inv">
                    <Package size={16} />
                    <span>{order.invoice_number || `ORD-${order.id}`}</span>
                  </div>

                  <p className="order-card__date">
                    {order.order_date
                      ? new Date(order.order_date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>

                <span className={`badge ${statusColor(order.status)}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getStatusIcon(order.status)}
                  {order.status || "PENDING"}
                </span>
              </div>

              <div className="order-card__body">
                <div className="order-card__row">
                  <span>Subtotal</span>
                  <span>
                    ₹{Number(order.total_amount || 0).toFixed(2)}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="order-card__row order-card__row--discount">
                    <span>Discount applied</span>
                    <span>
                      −₹{Number(order.discount).toFixed(2)}
                    </span>
                  </div>
                )}

                {order.gst_total > 0 && (
                  <div className="order-card__row">
                    <span>Tax (GST)</span>
                    <span>
                      ₹{Number(order.gst_total).toFixed(2)}
                    </span>
                  </div>
                )}

                <hr className="divider" />

                <div className="order-card__row order-card__row--total">
                  <span>Grand Total</span>
                  <span>
                    ₹{Number(order.final_amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* ✅ ACTION BUTTONS */}
              <div className="order-card__actions">
                {/* Pay Now – only for unpaid orders */}
                {(order.status === "PENDING" || order.status === "PARTIAL") && (
                  <button
                    className="btn btn-accent btn-sm"
                    onClick={() => handlePayNow(order)}
                    disabled={payingOrderId === order.id}
                    style={{ gap: '8px' }}
                  >
                    {payingOrderId === order.id ? "Processing..." : (
                      <>
                        <CreditCard size={16} /> Pay Now
                      </>
                    )}
                  </button>
                )}

                {/* Download Invoice */}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => downloadInvoice(order.id)}
                  style={{ gap: '8px' }}
                >
                  <Download size={16} /> Invoice
                </button>
                
                <Link to={`/orders/${order.id}`} className="btn btn-ghost btn-sm" style={{ gap: '8px' }}>
                  <FileText size={16} /> Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}