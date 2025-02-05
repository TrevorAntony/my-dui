import { Navigate, Outlet } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";
import { checkAuthEnabled, checkUserLoggedIn } from "../utils/auth-utils";

const PrivateRoute = () => {
  const { state } = useAppState();
  const isAuthEnabled = checkAuthEnabled(state);
  const isLoggedIn = checkUserLoggedIn(state);

  if (!isAuthEnabled) {
    return <Outlet />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
