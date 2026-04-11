import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@features/auth/store/auth.store";
import GoogleLoginButton from "@features/auth/components/GoogleLoginButton";
import DynText from '@core/i18n/DynText';
import "@/styles/AuthPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const { addToast } = useToastStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }
    if (form.password.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }
    try {
      await register({ name: form.name, email: form.email, mobile: form.mobile, password: form.password });
      addToast("OTP sent to your email! 📧", "success");
      navigate("/auth/verify-otp", { state: { email: form.email } });
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide animate-pop">
        <div className="auth-card__header">
          <Link to="/" className="auth-logo">🌿 AgroPlatform</Link>
          <h1 className="auth-card__title"><DynText text="Create Account" /></h1>
          <p className="auth-card__subtitle"><DynText text="Join 50,000+ Indian farmers today" /></p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="register-form">
          <div className="auth-form__row">
            <div className="form-group">
              <label className="form-label"><DynText text="Full Name" /></label>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label"><DynText text="Mobile Number" /></label>
              <input
                id="reg-mobile"
                type="tel"
                className="form-input"
                placeholder="10-digit mobile number"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label"><DynText text="Email Address" /></label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="auth-form__row">
            <div className="form-group">
              <label className="form-label"><DynText text="Password" /></label>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label"><DynText text="Confirm Password" /></label>
              <input
                id="reg-confirm"
                type="password"
                className="form-input"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading
              ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              : <><DynText text="Create Account" /> →</>}
          </button>
        </form>

        <div className="auth-divider">
          <span><DynText text="OR" /></span>
        </div>

        <GoogleLoginButton />

        <div className="auth-card__footer">
          <p className="auth-footer-text">
            <DynText text="Already have an account?" />{" "}
            <Link to="/auth/login" className="auth-link" id="go-login-link"><DynText text="Login" /></Link>
          </p>
        </div>
      </div>

      <div className="auth-side">
        <div className="auth-side__content">
          <h2><DynText text="Logistics Network Onboarding" /></h2>
          <div className="auth-side__points">
            <div className="auth-side__point">
              <span className="auth-side__icon">📋</span>
              <span><DynText text="Managed Sourcing Protocols" /></span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">🆔</span>
              <span><DynText text="Verified Supply-Chain IDs" /></span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">📦</span>
              <span><DynText text="Real-Time Inventory Control" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
