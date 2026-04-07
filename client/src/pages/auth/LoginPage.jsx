import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useToastStore from "../../store/toastStore";
import GoogleLoginButton from "../../components/Auth/GoogleLoginButton";
import "../../styles/AuthPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuthStore();
  const { addToast } = useToastStore();
  const [form, setForm] = useState({ email: "", password: "" });

  const from = location.state?.from?.pathname || "/";

  // Check for Google Auth errors from redirected URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get("error");
    if (errorParam) {
      if (errorParam === "access_denied") {
        addToast("Permission denied. Ensure your email is in the 'Test Users' list! 🌿", "error");
      } else if (errorParam === "auth_failed") {
        addToast("Authentication logic failed. Check server logs.", "error");
      } else {
        addToast(`Google login error: ${errorParam}`, "error");
      }
      
      // Clear URL params without reloading to prevent repeated toasts
      navigate("/auth/login", { replace: true });
    }
  }, [location.search, addToast, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      addToast("Welcome back! 🌿", "success");
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-pop">
        <div className="auth-card__header">
          <Link to="/" className="auth-logo">🌿 AgroMart</Link>
          <h1 className="auth-card__title">Welcome Back</h1>
          <p className="auth-card__subtitle">Login to your farmer account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
            <Link to="/auth/forgot-password" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>Forgot Password?</Link>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : "Login →"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <GoogleLoginButton />

        <div className="auth-card__footer">
          <p className="auth-footer-text">
            New to AgroMart?{" "}
            <Link to="/auth/register" className="auth-link" id="go-register-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-side">
        <div className="auth-side__content">
          <h2>Industrial Supply Gateway</h2>
          <div className="auth-side__points">
            <div className="auth-side__point">
              <span className="auth-side__icon">⚙️</span>
              <span>Direct Sourcing Infrastructure</span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">📦</span>
              <span>Real-Time Inventory Control</span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">🚛</span>
              <span>QA-Verified Logistics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
