import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "@features/checkout/store/cart.store";
import useAuthStore from "@features/auth/store/auth.store";
import "@/styles/cartPage.css";

export default function CartPage() {
  const { items, total, discount, final: finalAmount, fetchCart, updateQty, checkout, loading } = useCartStore();
  const { customer } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (customer?.id) {
      fetchCart(customer.id);
    }
  }, [customer?.id]);

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const res = await checkout(customer.id, customer.user_id || customer.id);

      const orderId =
        res?.id ||
        res?.order_id ||
        res?.data?.id ||
        res?.data?.order_id;

      if (!orderId) {
        console.error("Invalid response:", res);
        alert("Checkout failed: invalid response");
        return;
      }

      navigate(`/checkout/payment/${orderId}`);
    } catch (err) {
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Checkout failed"
      );
    }
  };

  return (
    <div className="cart-page">
      <h2 className="cart-title">🛒 Your Cart</h2>

      <div className="cart-container">
        {/* LEFT */}
        <div className="cart-left">
          {items.length === 0 && (
            <div className="empty-cart">
              <h3>No items in cart 🚜</h3>
            </div>
          )}

          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
              </div>

              <div className="item-qty">
                <button onClick={() => customer && updateQty(item.id, item.quantity - 1, customer.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => customer && updateQty(item.id, item.quantity + 1, customer.id)}>+</button>
              </div>

              <div className="item-price">
                <p>₹{item.total}</p>
                <p className="discount">-₹{item.discount}</p>
                <h4>₹{item.final}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="cart-right">
          <h3>Price Details</h3>

          <div className="summary-row">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="summary-row discount">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>

          <hr />

          <div className="summary-row final">
            <span>Final Amount</span>
            <span>₹{finalAmount}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}