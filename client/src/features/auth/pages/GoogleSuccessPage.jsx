import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@features/auth/store/auth.store";
import useToastStore from "@core/hooks/useToast";
import AgroLoader from "@core/components/AgroLoader";

const GoogleSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { init } = useAuthStore();
    const { addToast } = useToastStore();

    useEffect(() => {
        const handleSuccess = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get("token");

            if (token) {
                try {
                    // 1. Store token
                    localStorage.setItem("agromart_token", token);
                    
                    // 2. Initialize auth state from token
                    await init();
                    
                    addToast("Welcome back via Google! 🌿", "success");
                    
                    // 3. Redirect to home or dashboard
                    navigate("/", { replace: true });
                } catch (err) {
                    console.error("Auth initialization failed:", err);
                    addToast("Failed to initialize session. Please try again.", "error");
                    navigate("/auth/login", { replace: true });
                }
            } else {
                addToast("Authentication token missing. Please login again.", "error");
                navigate("/auth/login", { replace: true });
            }
        };

        handleSuccess();
    }, [location, navigate, init, addToast]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <AgroLoader />
            <p className="mt-4 text-gray-600 animate-pulse">Completing secure authentication...</p>
        </div>
    );
};

export default GoogleSuccessPage;
