import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  CreditCard, 
  CheckCircle, 
  Truck, 
  ShieldCheck, 
  Package, 
  Sprout, 
  Skull, 
  Info, 
  Leaf,
  MapPin,
  Phone,
  Building
} from "lucide-react";
import useCartStore from "@features/checkout/store/cart.store";
import useAuthStore from "@features/auth/store/auth.store";
import useToastStore from "@core/hooks/useToast";
import api from "@core/api/client";
import "@/styles/CheckoutPage.css";

// ✅ Dynamically load Razorpay SDK if not already loaded
const loadRazorpaySDK = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, discount, final: finalAmount, checkout, loading } = useCartStore();
  const { customer, user } = useAuthStore();
  const { addToast } = useToastStore();

  const handlePlaceOrder = async () => {
    if (!customer) {
      addToast("Customer profile not loaded. Please re-login.", "error");
      return;
    }

    if (items.length === 0) {
      addToast("Your cart is empty!", "error");
      navigate("/products");
      return;
    }

    // ✅ Capture amount BEFORE calling checkout(), which clears cart state to 0
    const amountBeforeCheckout = finalAmount || total;

    try {
      // ✅ STEP 1: Create order via cart checkout
      const result = await checkout(
        customer.id,
        user?.id || customer.id
      );

      const order = result?.data || result;
      const orderId = order?.id;
      // ✅ Use server's final_amount first, then the pre-saved local amount
      const orderAmount = Number(order?.final_amount) || amountBeforeCheckout || 1;

      if (!orderId) {
        addToast("Order created but could not get order ID", "error");
        return;
      }

      addToast("Order placed! Starting payment...", "success");

      // ✅ STEP 2: Create Razorpay payment order
      const rzpRes = await api.post("/payments/create-order", {
        order_id: orderId,
        amount: orderAmount
      });

      const rzpOrder = rzpRes;

      if (!rzpOrder || !rzpOrder.id) {
        const targetOrdersPath = user?.role === "ADMIN" ? "/admin/orders" : "/orders";
        navigate(targetOrdersPath);
        return;
      }

      // ✅ STEP 3: Ensure Razorpay SDK is loaded (dynamic fallback)
      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded || !window.Razorpay) {
        console.error("Razorpay SDK Error: window.Razorpay not found after load attempt");
        const targetOrdersPath = user?.role === "ADMIN" ? "/admin/orders" : "/orders";
        navigate(targetOrdersPath);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: rzpOrder.amount,
        currency: "INR",
        order_id: rzpOrder.id,
        name: "AgroMart",
        description: `Order #${orderId}`,
        prefill: {
          name: customer?.name || "Customer",
          contact: customer?.mobile || "",
          email: customer?.email || ""
        },
        theme: { color: "#059669" },

        handler: async (response) => {
          try {
            // ✅ STEP 4: Verify payment
            const verifyRes = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderId,
              amount: orderAmount
            });

            addToast("Payment successful!", "success");

            const targetPath = user?.role === "ADMIN" ? "/admin/orders" : "/orders";
            navigate(targetPath);
          } catch (err) {
            console.error("VERIFY ERROR:", err);
            addToast("Payment verification failed. Contact support.", "error");
            const failPath = user?.role === "ADMIN" ? "/admin/orders" : "/orders";
            navigate(failPath);
          }
        },

        modal: {
          ondismiss: function () {
            addToast("Payment cancelled. You can pay later from Orders.", "info");
            const targetPath = user?.role === "ADMIN" ? "/admin/orders" : "/orders";
            navigate(targetPath);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        const targetOrdersPath = user?.role === "ADMIN" ? "/admin/orders" : "/orders";
        navigate(targetOrdersPath);
      });
      rzp.open();

    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      addToast(err.message || "Checkout failed", "error");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "80px 20px" }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={80} strokeWidth={1} style={{ opacity: 0.2 }} />
          </div>
          <h3>Your cart is empty</h3>
          <p>Add products before checking out</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container fade-in">
      <h1 className="checkout-page__title">Review & Place Order</h1>

      <div className="checkout-page__layout">
        {/* ORDER ITEMS */}
        <div className="checkout-items">
          <h2 className="checkout-items__title">Order Summary</h2>

          {items.map((item) => (
            <div key={item.id} className="checkout-item">
              <div className="checkout-item__icon">
                {getProductIcon(item.name)}
              </div>

              <div className="checkout-item__info">
                <p className="checkout-item__name">{item.name}</p>
                <p className="checkout-item__meta">
                  ₹{item.price?.toFixed(2)} × {item.quantity}
                </p>
              </div>

              <div className="checkout-item__total">
                ₹{item.final?.toFixed(2)}
              </div>
            </div>
          ))}

          {/* DELIVERY */}
          <div className="checkout-delivery">
            <div className="checkout-delivery__icon">
              <Truck size={24} />
            </div>
            <div>
              <p className="checkout-delivery__title">Farm Delivery</p>
              <p className="checkout-delivery__desc">
                Estimated 2–5 days · Delivering to{" "}
                {customer?.village ? customer.village : "your location"}
              </p>
            </div>
            <span className="checkout-delivery__free">FREE</span>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="checkout-summary">
          <h2 className="checkout-summary__title">Price Details</h2>

          <div className="checkout-summary__rows">
            <div className="checkout-summary__row">
              <span>Price ({items.length} items)</span>
              <span>₹{total?.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="checkout-summary__row checkout-summary__row--discount">
                <span>Discount</span>
                <span>−₹{discount?.toFixed(2)}</span>
              </div>
            )}

            <div className="checkout-summary__row">
              <span>Delivery Charges</span>
              <span className="checkout-summary__free">FREE</span>
            </div>

            <hr className="divider" />

            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total Amount</span>
              <span>₹{finalAmount?.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <p className="checkout-summary__savings">
                Great! You save ₹{discount?.toFixed(2)}
              </p>
            )}
          </div>

          {/* CUSTOMER */}
          {customer && (
            <div className="checkout-customer">
              <h3>Delivering to</h3>
              <p className="customer-name">
                <CheckCircle size={16} /> <strong>{customer.name}</strong>
              </p>
              <p><Phone size={14} /> {customer.mobile}</p>
              {customer.village && <p><MapPin size={14} /> {customer.village}</p>}
              {customer.gst && <p><Building size={14} /> GST: {customer.gst}</p>}
            </div>
          )}

          <button
            id="place-order-btn"
            className="btn btn-accent btn-full btn-lg"
            onClick={handlePlaceOrder}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            {loading ? "Processing" : (
              <>
                Place Order & Pay <CreditCard size={20} />
              </>
            )}
          </button>

          <div className="checkout-trust">
            <div className="trust-item"><ShieldCheck size={16} /> <span>Secure Payment</span></div>
            <div className="trust-item"><CheckCircle size={16} /> <span>Verified Products</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getProductIcon(name = "") {
  const n = name.toLowerCase();
  const iconSize = 24;
  const iconStyle = { opacity: 0.6 };

  if (n.includes("fertiliz") || n.includes("npk") || n.includes("urea"))
    return <Sprout size={iconSize} style={iconStyle} />;
  if (n.includes("pesticid") || n.includes("insect"))
    return <Skull size={iconSize} style={iconStyle} />;
  if (n.includes("medic") || n.includes("bio") || n.includes("fungic"))
    return <Info size={iconSize} style={iconStyle} />;
  if (n.includes("seed"))
    return <Leaf size={iconSize} style={iconStyle} />;

  return <Package size={iconSize} style={iconStyle} />;
}