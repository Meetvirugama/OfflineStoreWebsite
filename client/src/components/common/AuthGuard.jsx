import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function AuthGuard({ children }) {
  const { token, initialized } = useAuthStore();
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}
