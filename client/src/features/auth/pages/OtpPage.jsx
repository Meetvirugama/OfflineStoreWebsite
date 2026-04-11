import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@features/auth/store/auth.store";
import useToastStore from "@core/hooks/useToast";
import DynText from '@core/i18n/DynText';
import "@/styles/AuthPage.css";

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp, loading: storeLoading } = useAuthStore();
  const { addToast } = useToastStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) navigate("/auth/register");
    inputRefs.current[0]?.focus();
  }, [email]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      const newOtp = paste.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      setLoading(true);
      await resendOtp(email);
      addToast(<DynText text="A new OTP has been sent to your email! 📧" />, "success");
      setResendTimer(60);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      addToast(<DynText text="Please enter all 6 digits" />, "error");
      return;
    }
    try {
      await verifyOtp(email, code);
      addToast(<DynText text="Email verified successfully! 🎉 Please login." />, "success");
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
          <h1 className="auth-card__title"><DynText text="Verify Email" /></h1>
          <p className="auth-card__subtitle">
            <DynText text="We sent a 6-digit OTP to" /><br />
            <strong>{email}</strong>
          </p>
        </div>

        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="otp-input"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <button
            id="otp-verify-btn"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={storeLoading || otp.some((d) => !d)}
          >
            {storeLoading
              ? <span className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} />
              : <><DynText text="Verify OTP" /> →</>}
          </button>
        </form>

        <div className="auth-card__footer">
          <div className="otp-resend-container">
            <p className="otp-resend-text">
              <DynText text="Didn't get the code?" />{" "}
              {resendTimer > 0 ? (
                <span className="otp-timer"><DynText text="Wait" /> {resendTimer}s</span>
              ) : (
                <button 
                  onClick={handleResend} 
                  className="btn-resend"
                >
                  <DynText text="Resend OTP" />
                </button>
              )}
            </p>
          </div>
          
          <p style={{ fontSize: '14px' }}>
            <DynText text="Wrong email?" /> <Link to="/auth/register" className="auth-link"><DynText text="Register again" /></Link>
          </p>
          <p style={{ marginTop: 12, fontSize: '14px' }}>
            <Link to="/auth/login" className="auth-link"><DynText text="Back to Login" /></Link>
          </p>
        </div>
      </div>

      <div className="auth-side">
        <div className="auth-side__content">
          <h2><DynText text="Cryptographic Identity Link" /></h2>
          <div className="auth-side__points">
            <div className="auth-side__point">
              <span className="auth-side__icon">🔐</span>
              <span><DynText text="Multi-Factor System Security" /></span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">🆔</span>
              <span><DynText text="Verified Supply-Chain IDs" /></span>
            </div>
            <div className="auth-side__point">
              <span className="auth-side__icon">📡</span>
              <span><DynText text="Real-Time Node Sync" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
