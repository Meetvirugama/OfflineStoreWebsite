import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@features/auth/store/auth.store";
import useToastStore from "@core/hooks/useToast";
import GoogleLoginButton from "@features/auth/components/GoogleLoginButton";
import "@/styles/AuthPage.css";

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
      addToast("Welcome back to AgroPlatform!", "success");
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-pop">
        <div className="auth-card__header">
          <Link to="/" className="auth-logo">🌿 AgroPlatform</Link>
          <h1 className="auth-card__title">Welcome Back</h1>
          <p className="auth-card__subtitle">Please enter your credentials to access your dashboard.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="user@example.com"
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
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
            <Link to="/auth/forgot-password" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>Forgot password?</Link>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : "Secure Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <GoogleLoginButton />

        <div className="auth-card__footer">
          <p className="auth-footer-text">
            New to AgroPlatform?{" "}
            <Link to="/auth/register" className="auth-link" id="go-register-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-side">
        <div className="auth-side__content">
          <h2>Bharat's Precision Agro-Ecosystem</h2>
          <div className="auth-side__points">
            <div className="auth-side__point">
              <span className="auth-side__icon">⚙️</span>
              <span>Direct Farm-to-Business Sourcing</span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">📦</span>
              <span>Real-time Supply Chain Visibility</span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">🚛</span>
              <span>Quality-Assured Cold Chain Logistics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
