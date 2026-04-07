import { 
  Shield, 
  Key, 
  Zap, 
  User, 
  Phone, 
  Mail, 
  Layout, 
  Package, 
  ShoppingCart, 
  Users,
  ChevronRight,
  ShieldCheck,
  Activity
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminProfile.css";

export default function AdminProfilePage() {
    const { user, customer } = useAuthStore();
    const navigate = useNavigate();

    // The 'customer' object holds the unified profile for the admin (User + some customer fields if any)
    const profile = customer || user;

    if (!profile) return (
        <div className="loading-center">
            <div className="spinner" />
        </div>
    );

    const stats = [
        { label: "Administrative Oversight", value: "Level 4 Executive", icon: <ShieldCheck size={24} /> },
        { label: "Console Access", value: "Verified Root", icon: <Key size={24} /> },
        { label: "System Status", value: "99.9% Optimal", icon: <Activity size={24} /> },
    ];

    const quickLinks = [
        { label: "Dashboard", to: "/admin", icon: <Layout size={20} /> },
        { label: "Inventory", to: "/admin/products", icon: <Package size={20} /> },
        { label: "Transactions", to: "/admin/orders", icon: <ShoppingCart size={20} /> },
        { label: "Suppliers", to: "/admin/suppliers", icon: <Users size={20} /> },
    ];

    return (
        <div className="admin-profile-elite-wrap fade-in">
            {/* HERO SECTION - Midnight Executive Theme */}
            <div className="admin-profile-hero">
                <div className="admin-profile-hero__accent-gold" />

                <div className="admin-profile-hero__content">
                    <div className="admin-profile-hero__avatar">
                        <Shield size={60} strokeWidth={1.5} />
                    </div>
                    
                    <div className="admin-profile-hero__text">
                        <div className="admin-profile-hero__badge">
                            <Zap size={14} fill="currentColor" /> AgroMart Executive Council
                        </div>
                        <h1 className="admin-profile-hero__title">{profile.name}</h1>
                        <p className="admin-profile-hero__subtitle">
                           Authenticated Executive Access: <span className="admin-profile-hero__email">{profile.email}</span> 
                           <br />
                           Authorized for system-wide overrides, inventory management, and fiscal oversight.
                        </p>
                    </div>
                </div>
            </div>

            <div className="admin-profile-grid">
                
                {/* IDENTITY CARD */}
                <div className="elite-card elite-card--tinted">
                    <h3 className="elite-card__title">
                        <span className="elite-card__title-dot" /> Management Identity
                    </h3>
                    <div className="elite-card__rows">
                        <InfoRow label="Personnel ID" value={`#EX-${profile.id || profile.user_id}`} icon={<User size={16} />} />
                        <InfoRow label="Mobile Gateway" value={profile.mobile || "Secure Line"} icon={<Phone size={16} />} />
                        <InfoRow label="Access Protocol" value="Tier 1 Root Auth" icon={<Key size={16} />} />
                        <InfoRow label="Security Status" value="Active (High)" icon={<Shield size={16} />} />
                    </div>
                </div>

                {/* PRIVILEGE ACTIONS */}
                <div className="elite-card elite-card--tinted">
                    <h3 className="elite-card__title">
                        <span className="elite-card__title-dot" /> Executive Actions
                    </h3>
                    <div className="elite-quick-links">
                        {quickLinks.map(link => (
                            <button 
                                key={link.label}
                                className="elite-quick-link"
                                onClick={() => navigate(link.to)}
                            >
                                <div className="elite-quick-link__icon">{link.icon}</div>
                                <span>{link.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* SYSTEM INTEGRITY STATS */}
                <div className="elite-card elite-stats-dark">
                    <h3 className="elite-card__title">
                        <span className="elite-card__title-dot elite-card__title-dot--pulse" /> System Integrity
                    </h3>
                    <div className="elite-card__rows" style={{ gap: '16px' }}>
                        {stats.map(s => (
                            <div key={s.label} className="elite-stat-item">
                                <div className="elite-stat-item__icon-wrap">{s.icon}</div>
                                <div className="elite-stat-item__text-wrap">
                                    <p className="elite-stat-item__label">{s.label}</p>
                                    <p className="elite-stat-item__value">{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function InfoRow({ label, value, icon }) {
    return (
        <div className="elite-info-row">
            <span className="elite-info-row__label">
                {icon} {label}
            </span>
            <span className="elite-info-row__value">{value}</span>
        </div>
    );
}
