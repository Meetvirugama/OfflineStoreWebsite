import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import useCartStore from "@features/checkout/store/cart.store";
import "./MobileNav.css";

export default function MobileNav() {
  const location = useLocation();
  const { items, setDrawerOpen } = useCartStore();
  const cartCount = (Array.isArray(items) ? items : []).reduce((sum, i) => sum + i.quantity, 0);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <Link to="/" className={`mobile-nav__item ${isActive("/") ? "active" : ""}`}>
        <Home />
        <span>Home</span>
      </Link>

      <Link to="/products" className={`mobile-nav__item ${isActive("/products") ? "active" : ""}`}>
        <ShoppingBag />
        <span>Products</span>
      </Link>

      <button
        className="mobile-nav__item"
        onClick={() => setDrawerOpen && setDrawerOpen(true)}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <ShoppingCart />
        <span>Cart</span>
        {cartCount > 0 && <span className="mobile-nav__badge">{cartCount}</span>}
      </button>

      <Link to="/profile" className={`mobile-nav__item ${isActive("/profile") ? "active" : ""}`}>
        <User />
        <span>Profile</span>
      </Link>
    </nav>
  );
}
