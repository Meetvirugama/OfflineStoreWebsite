import { useState, useEffect } from "react";
import { 
  User, 
  Phone, 
  MapPin, 
  Building, 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  Gift, 
  Edit3, 
  ArrowLeft 
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import useToastStore from "../../store/toastStore";
import "../../styles/ProfilePage.css";

export default function ProfilePage() {
  const { customer, updateProfile, loading } = useAuthStore();
  const { addToast } = useToastStore();

  const [editing, setEditing] = useState(false);

  // ✅ Initialize form directly (NO useEffect needed)
  const [form, setForm] = useState(() => ({
    name: customer?.name || "",
    mobile: customer?.mobile || "",
    village: customer?.village || "",
    gst: customer?.gst || "",
  }));

  // ✅ Only update title (safe effect)
  useEffect(() => {
    document.title = "My Profile – AgroMart";
  }, []);

  // ✅ Sync form ONLY when entering edit mode
  const handleEdit = () => {
    setForm({
      name: customer?.name || "",
      mobile: customer?.mobile || "",
      village: customer?.village || "",
      gst: customer?.gst || "",
    });
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      addToast("Profile updated successfully!", "success");
      setEditing(false);
    } catch (err) {
      addToast(err.message || "Update failed", "error");
    }
  };

  if (!customer) {
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="profile-page container fade-in">
      <div className="profile-page__header">
        <h1 className="profile-page__title">My Profile</h1>
        {customer?.role === "ADMIN" && (
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = "/admin"}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={18} /> Return to Admin Dashboard
          </button>
        )}
      </div>

      <div className="profile-page__layout">
        {/* PROFILE CARD */}
        <div className="profile-card">
          <div className="profile-card__avatar">
            <User size={40} />
          </div>
          <h2 className="profile-card__name">{customer.name}</h2>
          
          <div className="profile-card__info">
            <div className="profile-card__info-row">
              <Phone size={14} /> <span>{customer.mobile}</span>
            </div>
            {customer.village && (
              <div className="profile-card__info-row">
                <MapPin size={14} /> <span>{customer.village}</span>
              </div>
            )}
          </div>

          <div className="profile-card__tags">
            <span className="badge badge-primary">
              {customer?.role === "ADMIN" ? "Administrator" : (customer?.tag || "ACTIVE")}
            </span>
          </div>
        </div>

        <div className="profile-content">
          {/* STATS - ONLY FOR CUSTOMERS OR IF DATA EXISTS */}
          {customer.role !== "ADMIN" && (
            <div className="profile-stats">
              <Stat 
                icon={<ShoppingCart size={20} />} 
                value={customer.total_purchase} 
                label="Total Purchase" 
                className="profile-stat-card--purchases"
              />
              <Stat 
                icon={<CheckCircle size={20} />} 
                value={customer.total_paid} 
                label="Amount Paid" 
                className="profile-stat-card--paid"
              />
              <Stat 
                icon={<Clock size={20} />} 
                value={customer.total_due} 
                label="Due Amount" 
                className="profile-stat-card--due"
              />
              <Stat 
                icon={<Gift size={20} />} 
                value={customer.discount_percent} 
                label="My Discount" 
                isPercent 
                className="profile-stat-card--discount"
              />
            </div>
          )}

          {/* EDIT */}
          <div className="profile-edit">
            <div className="profile-edit__header">
              <h2>Personal Information</h2>

              {!editing && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleEdit}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="profile-edit__form">
                <Input label="Full Name" value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })} />

                <Input label="Mobile" value={form.mobile}
                  onChange={(v) => setForm({ ...form, mobile: v })} />

                <Input label="Village" value={form.village}
                  onChange={(v) => setForm({ ...form, village: v })} />

                <Input label="GST Number" value={form.gst}
                  onChange={(v) => setForm({ ...form, gst: v })} />

                <div className="profile-edit__actions">
                  <button className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost btn-lg"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-edit__view">
                <Row label="Full Name" value={customer.name} icon={<User size={16} />} />
                <Row label="Mobile Number" value={customer.mobile} icon={<Phone size={16} />} />
                <Row label="Village / Location" value={customer.village} icon={<MapPin size={16} />} />
                <Row label="GST Identification" value={customer.gst} icon={<Building size={16} />} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ Small reusable components (clean code) */

function Stat({ icon, value, label, isPercent, className }) {
  return (
    <div className={`profile-stat-card ${className || ''}`}>
      <div className="profile-stat-card__icon">{icon}</div>
      <div className="profile-stat-card__val">
        {isPercent ? `${value || 0}%` : `₹${Number(value || 0).toLocaleString("en-IN")}`}
      </div>
      <div className="profile-stat-card__label">{label}</div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Row({ label, value, icon }) {
  return (
    <div className="profile-edit__view-row">
      <span>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon}
        <strong>{value || "Not Provided"}</strong>
      </div>
    </div>
  );
}