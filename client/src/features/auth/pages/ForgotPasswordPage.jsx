import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@features/auth/store/auth.store";
import useToastStore from "@core/hooks/useToast";
import "@/styles/AuthPage.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useAuthStore();
  const { addToast } = useToastStore();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      addToast("OTP sent to your email! 🔐", "success");
      // Redirect to reset page with email in state
      navigate("/auth/reset-password", { state: { email } });
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-pop">
        <div className="auth-card__header">
          <Link to="/" className="auth-logo">🌿 AgroPlatform</Link>
          <h1 className="auth-card__title">Reset Password</h1>
          <p className="auth-card__subtitle">Enter your email to receive recovery instructions</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <>Send Reset Link 📧</>}
          </button>
        </form>

        <div className="auth-card__footer" style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Remembered your password?{" "}
            <Link to="/auth/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-side">
        <div className="auth-side__content">
          <h2>Access Path Restoration</h2>
          <div className="auth-side__points">
            <div className="auth-side__point">
              <span className="auth-side__icon">🛡️</span>
              <span>Secure Encryption Rollback</span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">🔄</span>
              <span>Identity Validation Sync</span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">📋</span>
              <span>System Logs Continuity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
