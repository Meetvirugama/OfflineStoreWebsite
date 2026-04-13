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
  Menu,
  X,
  Newspaper,
  Zap,
  MapPin
} from "lucide-react";

import useAuthStore from "@features/auth/store/auth.store";
import useCartStore from "@features/checkout/store/cart.store";
import useNotificationStore from "@features/notifications/store/notification.store";
import api from "@core/api/client";
import NotificationPanel from "@core/components/NotificationPanel";
import "@/styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, logout } = useAuthStore();
  const { setDrawerOpen, items, fetchCart } = useCartStore();
  const { notifications, fetchNotifications } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await api.get(`/products?search=${searchQuery}&limit=5`);
        setSuggestions(res || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = (Array.isArray(items) ? items : []).reduce((sum, i) => sum + i.quantity, 0);
  const unreadCount = (Array.isArray(notifications) ? notifications : []).filter(n => !n.is_read).length;

  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchCart();
    }
  }, [token, fetchNotifications, fetchCart]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-natural">
      <div className="navbar-natural__top">
        <div className="navbar-natural__container">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/" className="navbar-natural__logo">
            <Leaf className="logo-icon" size={28} />
            AgroMart
          </Link>

          <div className="navbar-natural__search-container" ref={searchRef}>
            <form className="navbar-natural__search desktop-search" onSubmit={(e) => { e.preventDefault(); navigate(`/products?search=${searchQuery}`); setShowSuggestions(false); }}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                className="search-input-field"
              />
            </form>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((p) => (
                  <div 
                    key={p.id} 
                    className="suggestion-item"
                    onClick={() => {
                      navigate(`/products/${p.id}`);
                      setSearchQuery("");
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="suggestion-info">
                      <p className="suggestion-name">{p.name}</p>
                      <p className="suggestion-meta">{p.category} • ₹{p.selling_price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="navbar-natural__actions">
            <div className="action-pills-group">
              <div className="action-btn cart-btn" onClick={() => setDrawerOpen && setDrawerOpen(true)}>
                <ShoppingBag size={22} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>

              {token && user ? (
                <>
                  <div className="action-btn notif-wrapper" ref={notifRef}>
                    <div onClick={() => setShowNotif(!showNotif)}>
                      <Bell size={22} />
                      {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                    </div>
                    {showNotif && <NotificationPanel />}
                  </div>

                  <div className="profile-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    <div className="profile-btn">
                      <div className="avatar">{user.name?.[0].toUpperCase() || 'U'}</div>
                      <ChevronDown size={14} />
                    </div>
                    {menuOpen && (
                      <div className="profile-dropdown">
                        <div className="dropdown-header">
                          <p className="dropdown-title">{user.name}</p>
                          <p className="dropdown-subtitle">{user.email}</p>
                        </div>
                        <Link to="/profile" className="dropdown-item">
                          <User size={18} /> <span>Profile</span>
                        </Link>
                        <Link to="/orders" className="dropdown-item">
                          <Package size={18} /> <span>My Orders</span>
                        </Link>
                        {user.role === "ADMIN" && (
                          <Link to="/admin" className="dropdown-item">
                            <LayoutDashboard size={18} /> <span>Admin Panel</span>
                          </Link>
                        )}
                        <div className="dropdown-divider"></div>
                        <button onClick={handleLogout} className="dropdown-item text-danger">
                          <LogOut size={18} /> <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/auth/login" className="profile-auth-btn">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* SECONDARY RIBBON: PUBLIC FEATURES HUB */}
      <div className={`navbar-natural__ribbon ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-natural__container">
          <nav className="ribbon-nav">
            <Link to="/intelligence/mandi" className={`ribbon-link ${isActive('/intelligence/mandi') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              <Newspaper size={18} />
              <span>Market</span>
            </Link>
            <Link to="/nearby-mandis" className={`ribbon-link ${isActive('/nearby-mandis') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              <MapPin size={18} />
              <span>Mandi NearBy</span>
            </Link>
            <Link to="/pest-detection" className={`ribbon-link ${isActive('/pest-detection') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              <Skull size={18} />
              <span>Pest Alerts</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}