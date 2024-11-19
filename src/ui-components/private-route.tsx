import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({
  authenticationEnabled,
}: {
  authenticationEnabled: boolean;
}) => {
  const { isAuthenticated } = useAuth();

  if (!authenticationEnabled) {
    console.log("Authentication disabled, rendering outlet.");
    return <Outlet />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
