import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/use-auth";

function AuthGuard() {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default AuthGuard;
