import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({
  authenticationEnabled = true,
}: {
  authenticationEnabled: boolean;
}) => {
  const { isAuthenticated } = useAuth();

  if (!authenticationEnabled) return <Outlet />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
