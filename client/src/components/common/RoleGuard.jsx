import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function RoleGuard({ children, allowedRoles }) {
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  // Not logged in -> send to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If Admin/Staff try to hit Customer page or vice-versa
    if (user.role === "ADMIN" || user.role === "STAFF") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
