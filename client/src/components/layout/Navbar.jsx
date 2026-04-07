import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { 
  ShoppingBag, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  LayoutDashboard, 
  LogOut, 
  Package, 
  Leaf, 
  Sprout, 
  Skull, 
  Star, 
  BookOpen, 
  PenTool,
  Home,
  Menu,
  X
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import useNotificationStore from "../../store/notificationStore";
import NotificationPanel from "../common/NotificationPanel";
import "../../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, logout } = useAuthStore();
  const { open, setDrawerOpen, items } = useCartStore();
  const { notifications, fetchNotifications } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const unreadCount = notifications.filter(n => !n.is_opened).length;

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }

    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [token, fetchNotifications]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path, searchParams = "") => {
    if (searchParams) return location.pathname === path && location.search.includes(searchParams);
    return location.pathname === path && !location.search.includes("category");
  };

  return (
    <header className="navbar-natural">
      {/* ===== TOP BAR: Clean & Minimal ===== */}
      <div className="navbar-natural__top">
        <div className="navbar-natural__container">
          
          {/* MOBILE MENU TOGGLE */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* BRAND */}
          <Link to="/" className="navbar-natural__logo">
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            <Leaf className="logo-icon" size={28} strokeWidth={2.5} style={{ stroke: 'url(#logo-grad)' }} />
            Agro<span className="logo-accent">Mart</span>
          </Link>

          {/* SEARCH (Dashboard Style Desktop) */}
          <form className="navbar-natural__search desktop-search" onSubmit={handleSearch}>
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search natural products, fertilizers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field"
            />
          </form>

          {/* ACTIONS */}
          <div className="navbar-natural__actions">

            {/* CART (Always Visible) */}
            <div className="action-btn cart-btn" onClick={() => setDrawerOpen(!open)}>
              <ShoppingBag size={24} className="icon-gradient-emerald" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>

            {/* AUTHENTICATED ACTIONS */}
            {token && user ? (
              <>
                {/* NOTIFICATIONS */}
                <div className="action-btn desktop-only notif-wrapper" ref={notifRef}>
                  <div onClick={() => setShowNotif(!showNotif)} style={{ display: "flex", alignItems: "center", height: "100%" }}>
                    <Bell size={22} className="icon-gradient-amber" />
                    {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                  </div>
                  {showNotif && <NotificationPanel />}
                </div>

                {/* PROFILE MENU */}
                <div className="profile-menu" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                  <div className="profile-btn">
                    <div className="avatar">{user.name?.[0].toUpperCase() || 'U'}</div>
                    <span className="profile-name">{user.name?.split(" ")[0]}</span>
                    <ChevronDown size={16} />
                  </div>
                  {menuOpen && (
                    <div className="profile-dropdown">
                      <div className="dropdown-header">
                        <p className="dropdown-title">Welcome, {user.name?.split(" ")[0]}</p>
                        <p className="dropdown-subtitle">{user.role === "ADMIN" ? "Administrator" : (user.email || "AgroMart Member")}</p>
                      </div>
                      <Link to={user.role === "ADMIN" ? "/admin/profile" : "/profile"} className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <User size={16} style={{marginRight: 8}} />
                        View Profile
                      </Link>
                      <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <Package size={16} style={{marginRight: 8}} />
                        My Orders
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                          <LayoutDashboard size={16} style={{marginRight: 8}} />
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item text-danger">
                        <LogOut size={16} style={{marginRight: 8}} />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="profile-menu">
                <Link to="/auth/login" className="profile-btn sign-in-btn">
                  <div className="avatar guest">
                    <User size={18} />
                  </div>
                  <span className="profile-name">Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== MOBILE OVERLAY ===== */}
      {mobileMenuOpen && <div className="navbar-mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>}

      {/* ===== BOTTOM RIBBON & MOBILE DRAWER ===== */}
      <nav className={`navbar-natural__ribbon ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="navbar-natural__container ribbon-scroll">
          
          {/* SEARCH (Mobile Drawer Only) */}
          <form className="navbar-natural__search mobile-search" onSubmit={handleSearch}>
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field"
            />
          </form>

          <Link to="/products" className={`ribbon-tab ${isActive("/products") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Home size={18} />
            <span>All Products</span>
          </Link>
          <Link to="/products?category=Fertilizers" className={`ribbon-tab ${isActive("/products", "Fertilizers") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Sprout size={18} />
            <span>Fertilizers</span>
          </Link>
          <Link to="/products?category=Seeds" className={`ribbon-tab ${isActive("/products", "Seeds") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Leaf size={18} />
            <span>Seeds</span>
          </Link>
          <Link to="/products?category=Pesticides" className={`ribbon-tab ${isActive("/products", "Pesticides") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Skull size={18} />
            <span>Pesticides</span>
          </Link>
          <Link to="/offers" className={`ribbon-tab ${isActive("/offers") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Star size={18} />
            <span>Special Offers</span>
          </Link>
          <Link to="/organic-guide" className={`ribbon-tab ${isActive("/organic-guide") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <BookOpen size={18} />
            <span>Organic Guide</span>
          </Link>
          <Link to="/blog" className={`ribbon-tab ${isActive("/blog") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <PenTool size={18} />
            <span>Farming Blog</span>
          </Link>
          <Link to="/orders" className={`ribbon-tab ${isActive("/orders") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Package size={18} />
            <span>Track Orders</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}