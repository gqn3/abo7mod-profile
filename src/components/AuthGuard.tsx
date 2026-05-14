import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const AuthGuard = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const { user, loading, isAdminEmail } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="luxury-page flex items-center justify-center text-luxury-muted">
        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
        Loading secure area
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdminEmail) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
