import { useNavigate } from "react-router-dom";
import { ShoppingBag, X, Plus, Minus, ArrowRight, Package, Sprout, Leaf, Skull, Info } from "lucide-react";
import useCartStore from "@features/checkout/store/cart.store";
import useAuthStore from "@features/auth/store/auth.store";
import useToastStore from "@core/hooks/useToast";
import "@/styles/CartDrawer.css";

export default function CartDrawer() {
  const navigate = useNavigate();
  const { open, setDrawerOpen, items, total, discount, final, updateQty, loading } = useCartStore();
  const { customer, token } = useAuthStore();
  const { addToast } = useToastStore();

  const handleCheckout = () => {
    if (!token) {
      addToast("Please login to checkout", "info");
      navigate("/auth/login");
      setDrawerOpen(false);
      return;
    }
    setDrawerOpen(false);
    navigate("/checkout");
  };

  if (!open) return null;

  return (
    <>
      <div className="overlay" onClick={() => setDrawerOpen(false)} />
      <div className="cart-drawer">
        {/* HEADER */}
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            <ShoppingBag size={24} className="icon-gradient-emerald" style={{ marginRight: 10 }} />
            <span style={{ color: '#fff' }}>My Cart</span>
            {items.length > 0 && (
              <span className="cart-drawer__count">{items.length} items</span>
            )}
          </h2>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            className="cart-drawer__close-btn"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* ITEMS */}
        <div className="cart-drawer__items">
          {items.length === 0 ? (
            <div className="cart-drawer__empty fade-in">
              <div className="empty-illustration">
                <div className="empty-icon-glow">
                  <ShoppingBag size={80} strokeWidth={1.5} className="icon-gradient-emerald" />
                </div>
              </div>
              <h3>Your harvest is empty</h3>
              <p>Ready to pick the best agro supplies?</p>
              <button
                className="btn btn-primary"
                onClick={() => { setDrawerOpen(false); navigate("/products"); }}
              >
                Start Sourcing Now
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item fade-in">
                <div className="cart-item__img">
                  {getProductIcon(item.name)}
                </div>
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p className="cart-item__price">₹{item.price?.toLocaleString("en-IN")}</p>
                    {item.discount > 0 && (
                      <span className="cart-item__discount">−₹{item.discount?.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </div>
                <div className="cart-item__qty">
                  <button
                    className="cart-item__qty-btn"
                    onClick={() => customer && updateQty(item.id, item.quantity - 1, customer.id)}
                    disabled={loading || item.quantity <= 1}
                  ><Minus size={14} strokeWidth={3} /></button>
                  <span>{item.quantity}</span>
                  <button
                    className="cart-item__qty-btn"
                    onClick={() => customer && updateQty(item.id, item.quantity + 1, customer.id)}
                    disabled={loading}
                  ><Plus size={14} strokeWidth={3} /></button>
                </div>
                <div className="cart-item__total">₹{item.final?.toLocaleString("en-IN")}</div>
              </div>
            ))
          )}
        </div>

        {/* SUMMARY */}
        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__summary">
              <div className="cart-drawer__summary-row">
                <span>Subtotal</span>
                <span>₹{total?.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="cart-drawer__summary-row cart-drawer__summary-row--discount">
                  <span>Harvest Savings</span>
                  <span>−₹{discount?.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="cart-drawer__summary-row cart-drawer__summary-total">
                <span>Total Amount</span>
                <span>₹{final?.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <button
              id="checkout-btn"
              className="btn btn-accent btn-full btn-lg"
              onClick={handleCheckout}
              disabled={loading}
              style={{ gap: '12px' }}
            >
              {loading ? "Securing Transaction..." : (
                <>
                  Secure Checkout <ArrowRight size={20} strokeWidth={2.5} />
                </>
              )}
            </button>
            <button
              className="btn btn-ghost btn-full"
              onClick={() => { setDrawerOpen(false); navigate("/products"); }}
              style={{ marginTop: '12px', border: 'none' }}
            >
              Add More Items
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function getProductIcon(name = "") {
  const n = name.toLowerCase();
  const iconSize = 28;
  const iconStyle = { opacity: 0.7 };

  if (n.includes("fertiliz") || n.includes("npk") || n.includes("urea")) 
    return <Sprout size={iconSize} style={iconStyle} />;
  if (n.includes("pesticid") || n.includes("insect") || n.includes("spray")) 
    return <Skull size={iconSize} style={iconStyle} />;
  if (n.includes("medic") || n.includes("bio") || n.includes("fungic")) 
    return <Info size={iconSize} style={iconStyle} />;
  if (n.includes("seed")) 
    return <Leaf size={iconSize} style={iconStyle} />;
    
  return <Package size={iconSize} style={iconStyle} />;
}
