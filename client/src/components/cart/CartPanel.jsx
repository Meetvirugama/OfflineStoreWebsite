import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";
import "../../styles/cartPanel.css";

export default function CartPanel() {
  const { items, total, discount, final, open, setDrawerOpen, fetchCart, updateQty, removeItem, loading } = useCartStore();
  const { customer, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (customer?.id) {
      fetchCart(customer.id);
    }
  }, [customer?.id]);

  const handleCheckout = () => {
    setDrawerOpen(false);
    navigate("/checkout");
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {open && <div className="cart-overlay" onClick={() => setDrawerOpen(false)} />}

      <div className={`cart-panel ${open ? "open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header__left">
            <span className="cart-header__icon">🛒</span>
            <h2>My Cart</h2>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </div>
          <button className="cart-close-btn" onClick={() => setDrawerOpen(false)} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {!items || items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <p className="cart-empty__text">Your cart is empty</p>
              <button className="btn btn-outline btn-sm" onClick={() => { setDrawerOpen(false); navigate("/products"); }}>
                Browse Products
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__icon">
                  {getEmoji(item.name)}
                </div>
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.name}</p>
                  <p className="cart-item__price">₹{Number(item.price).toFixed(2)} each</p>
                </div>
                <div className="cart-item__controls">
                  <div className="cart-qty-controls">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQty(item.id, item.quantity - 1, customer?.id)}
                      disabled={loading}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQty(item.id, item.quantity + 1, customer?.id)}
                      disabled={loading}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  <p className="cart-item__total">₹{Number(item.final).toFixed(2)}</p>
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeItem(item.id, customer?.id)}
                    disabled={loading}
                    aria-label="Remove item"
                  >🗑</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer – Summary + Checkout */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>₹{Number(total).toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="cart-summary__row cart-summary__discount">
                  <span>Discount</span>
                  <span>−₹{Number(discount).toFixed(2)}</span>
                </div>
              )}
              <div className="cart-summary__row cart-summary__total">
                <span>Total</span>
                <span>₹{Number(final).toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <button
                id="cart-checkout-btn"
                className="btn btn-accent btn-full"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Loading..." : "Proceed to Checkout →"}
              </button>
            ) : (
              <button
                className="btn btn-primary btn-full"
                onClick={() => { setDrawerOpen(false); navigate("/auth/login"); }}
              >
                Login to Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function getEmoji(name = "") {
  const n = name.toLowerCase();
  if (n.includes("fertiliz") || n.includes("npk") || n.includes("urea")) return "🌱";
  if (n.includes("pesticid") || n.includes("insect")) return "🧴";
  if (n.includes("medic") || n.includes("bio") || n.includes("fungic")) return "💊";
  if (n.includes("seed")) return "🌾";
  return "📦";
}