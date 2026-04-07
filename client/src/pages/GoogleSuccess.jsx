import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useToastStore from "../store/toastStore";

export default function GoogleSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { init } = useAuthStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    const handleToken = async () => {
      const token = searchParams.get("token");

      if (token) {
        // 1. Store token in localStorage
        localStorage.setItem("agromart_token", token);
        
        addToast("Logged in with Google successfully!", "success");
        
        // 2. Initialize the store immediately with the new token
        await init(true);
        
        // 3. Redirect to home
        navigate("/", { replace: true });
      } else {
        addToast("No token found. Please try again.", "error");
        navigate("/auth/login", { replace: true });
      }
    };

    handleToken();
  }, [searchParams, navigate, addToast, init]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      gap: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #2e7d32', borderRadius: '50%' }}></div>
      <p style={{ color: '#64748b', fontSize: '18px', fontWeight: 500 }}>Finalizing authentication...</p>
    </div>
  );
}
