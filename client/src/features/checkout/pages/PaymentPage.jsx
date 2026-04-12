// src/pages/checkout/PaymentPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@core/api/client";
import useAuthStore from "@features/auth/store/auth.store";
import useToastStore from "@core/hooks/useToast";

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

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { customer, user } = useAuthStore();
  const { addToast } = useToastStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // ✅ Fetch live order data (not stale cart state)
  useEffect(() => {
    document.title = "Payment – AgroMart";
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res);
      } catch {
        const targetPath = user?.role === "ADMIN" ? "/admin/orders" : "/orders";
        navigate(targetPath);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    if (!order) return;

    const paid = Number(order.paid_amount || 0);
    const amountToPay = Number(order.final_amount) - paid;

    if (amountToPay <= 0) {
      const targetPath = user?.role === "ADMIN" ? "/admin/orders" : "/orders";
      navigate(targetPath);
      return;
    }

    try {
      setPaying(true);

      // ✅ STEP 1: Create Razorpay order on backend
      const rzpRes = await api.post("/payments/create-order", {
        order_id: orderId,
        amount: amountToPay,
      });

      const rzpOrder = rzpRes;
      if (!rzpOrder?.id) {
        addToast("Failed to create payment order. Try again.", "error");
        return;
      }

      // ✅ STEP 2: Ensure SDK is loaded
      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded || !window.Razorpay) {
        addToast("Payment SDK failed to load. Please refresh.", "error");
        return;
      }

      // ✅ STEP 3: Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: rzpOrder.amount,
        currency: "INR",
        order_id: rzpOrder.id,
        name: "AgroMart 🌿",
        description: `Payment for Order #${orderId}`,
        prefill: {
          name: customer?.name || "Customer",
          contact: customer?.mobile || "",
          email: customer?.email || "",
        },
        theme: { color: "#16a34a" },

        handler: async (response) => {
          try {
            // ✅ STEP 4: Verify payment
            const verifyRes = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderId,
              amount: amountToPay,
            });

            addToast("Payment successful! 🎉", "success");
            const targetPath = user?.role === "ADMIN" ? "/admin/orders" : "/orders";
            navigate(targetPath);
          } catch (err) {
            console.error("VERIFY ERROR:", err);
            addToast("Payment verification failed. Contact support.", "error");
          }
        },

        modal: {
          ondismiss: () => {
            addToast("Payment cancelled. You can pay later from Orders.", "info");
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        addToast("Payment failed. Please try again.", "error");
        setPaying(false);
      });
      rzp.open();

    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      addToast(err.response?.data?.message || err.message || "Payment failed", "error");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );
  }

  const amountDue = Number(order?.final_amount || 0) - Number(order?.paid_amount || 0);

  return (
    <div className="container" style={{ padding: "60px 20px", maxWidth: 480, margin: "0 auto" }}>
      <div className="card" style={{ padding: 36, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>💳</div>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Complete Payment</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
          Order #{orderId}
        </p>

        <div style={{
          background: "var(--bg-alt)",
          borderRadius: "var(--radius)",
          padding: "20px 24px",
          marginBottom: 28,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "var(--text-muted)" }}>Order Total</span>
            <span>₹{Number(order?.final_amount || 0).toFixed(2)}</span>
          </div>
          {Number(order?.paid_amount) > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "var(--text-muted)" }}>Already Paid</span>
              <span style={{ color: "var(--success)" }}>−₹{Number(order.paid_amount).toFixed(2)}</span>
            </div>
          )}
          <hr className="divider" style={{ margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700 }}>Amount Due</span>
            <span style={{ fontWeight: 700, fontSize: 22, color: "var(--primary-dark)" }}>
              ₹{amountDue.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          className="btn btn-accent btn-full btn-lg"
          onClick={handlePayment}
          disabled={paying || amountDue <= 0}
        >
          {paying ? "Processing..." : <>Pay ₹{amountDue.toFixed(2)}</>}
        </button>

        <button
          className="btn btn-ghost btn-full btn-sm"
          style={{ marginTop: 12 }}
          onClick={() => {
            const targetPath = user?.role === "ADMIN" ? "/admin/orders" : "/orders";
            navigate(targetPath);
          }}
        >
          Pay Later
        </button>

        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 20 }}>
          🔒 Secured by Razorpay · 256-bit SSL Encryption
        </p>
      </div>
    </div>
  );
}