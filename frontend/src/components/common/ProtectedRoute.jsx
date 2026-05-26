// components/common/ProtectedRoute.jsx
// Redirects unauthenticated users to login page

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "./index";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Wait for auth state to rehydrate from localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900">
        <Spinner text="Authenticating..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login and remember where they were trying to go
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
