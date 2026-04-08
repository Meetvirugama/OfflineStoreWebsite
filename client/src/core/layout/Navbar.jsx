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
import NotificationPanel from "@core/components/NotificationPanel";
import "@/styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = location = useLocation();
  const { token, user, logout } = useAuthStore();
  const { setDrawerOpen, items } = useCartStore();
  const { notifications, fetchNotifications } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token, fetchNotifications]);

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
            Agro<span className="logo-accent">Mart</span>
          </Link>

          <form className="navbar-natural__search desktop-search">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field"
            />
          </form>

          <div className="navbar-natural__actions">
            <div className="action-btn cart-btn" onClick={() => setDrawerOpen && setDrawerOpen(true)}>
              <ShoppingBag size={24} />
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
                    <ChevronDown size={16} />
                  </div>
                  {menuOpen && (
                    <div className="profile-dropdown">
                      <Link to="/profile" className="dropdown-item">Profile</Link>
                      <Link to="/orders" className="dropdown-item">My Orders</Link>
                      {user.role === "ADMIN" && <Link to="/admin" className="dropdown-item">Admin</Link>}
                      <button onClick={handleLogout} className="dropdown-item text-danger">Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/auth/login" className="profile-btn">Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}