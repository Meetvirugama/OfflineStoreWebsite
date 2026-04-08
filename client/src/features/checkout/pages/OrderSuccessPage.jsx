import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@core/api/client";
import "@/styles/OrderSuccessPage.css";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const [downloading, setDownloading] = useState(false);

  const order = location.state?.order;

  useEffect(() => {
    document.title = "Order Placed – AgroMart";
  }, []);

  // ✅ FIX: Download invoice with auth token (not window.open which has no token)
  const downloadInvoice = async () => {
    try {
      setDownloading(true);
      const response = await api.get(`/invoice/${orderId}`, {
        responseType: "blob"
      });

      // Create download link from blob
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice download error:", err);
      alert(err.response?.status === 404
        ? "Invoice not generated yet. It may take a moment."
        : "Failed to download invoice. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="order-success">
      <div className="order-success__card animate-pop">
        <div className="order-success__icon">🎉</div>
        <h1 className="order-success__title">Payment Successful!</h1>

        <p className="order-success__subtitle">
          Your order has been confirmed and invoice generated.
        </p>

        {order && (
          <div className="order-success__details">
            {order.invoice_number && (
              <div className="order-success__row">
                <span>Invoice No.</span>
                <strong>{order.invoice_number}</strong>
              </div>
            )}

            <div className="order-success__row">
              <span>Order ID</span>
              <strong>#{orderId}</strong>
            </div>

            <div className="order-success__row">
              <span>Total Amount</span>
              <strong>₹{Number(order.final_amount).toFixed(2)}</strong>
            </div>

            <div className="order-success__row">
              <span>Status</span>
              <span className="badge badge-success">
                {order.status || "PAID"}
              </span>
            </div>
          </div>
        )}

        {/* 🔥 INVOICE DOWNLOAD BUTTON */}
        <div className="order-success__actions">
          <button
            className="btn btn-primary"
            onClick={downloadInvoice}
            disabled={downloading}
          >
            {downloading ? "⏳ Downloading..." : "📄 Download Invoice"}
          </button>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/orders")}
          >
            My Orders
          </button>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}