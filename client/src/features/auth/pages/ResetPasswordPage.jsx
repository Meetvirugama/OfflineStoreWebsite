import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@features/auth/store/auth.store";
import useToastStore from "@core/hooks/useToast";
import DynText from '@core/i18n/DynText';
import "@/styles/AuthPage.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, loading } = useAuthStore();
  const { addToast } = useToastStore();

  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return addToast("Passwords do not match", "error");
    }
    
    try {
      await resetPassword(form.email, form.otp, form.newPassword);
      addToast("Password reset successful! Please login. 🌿", "success");
      navigate("/auth/login");
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-pop">
        <div className="auth-card__header">
          <Link to="/" className="auth-logo">🌿 AgroPlatform</Link>
          <h1 className="auth-card__title"><DynText text="Create New Password" /></h1>
          <p className="auth-card__subtitle"><DynText text="Enter the 6-digit code sent to your email" /></p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><DynText text="Email Address" /></label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              readOnly={!!location.state?.email}
            />
          </div>

          <div className="form-group">
            <label className="form-label"><DynText text="Verification Code (OTP)" /></label>
            <input
              type="text"
              className="form-input"
              placeholder="000000"
              maxLength="6"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label"><DynText text="New Password" /></label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label"><DynText text="Confirm New Password" /></label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><DynText text="Reset Password" /> →</>}
          </button>
        </form>

        <div className="auth-card__footer" style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            <DynText text="Back to" />{" "}
            <Link to="/auth/login" className="auth-link">
              <DynText text="Login" />
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-side">
        <div className="auth-side__content">
          <h2><DynText text="Hardware-Level Security Reset" /></h2>
          <div className="auth-side__points">
            <div className="auth-side__point">
              <span className="auth-side__icon">🛡️</span>
              <span><DynText text="End-to-End Vault Access" /></span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">💰</span>
              <span><DynText text="Financial Ledger Protection" /></span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">📋</span>
              <span><DynText text="System Policy Enforcement" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
