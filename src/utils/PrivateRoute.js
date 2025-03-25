import { Navigate } from "react-router-dom";
import useAuthStore from "./authStore";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
