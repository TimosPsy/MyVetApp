import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/context/AuthProvider.tsx";


interface ProtectedRouteProps {
    requiredCapability?: string;
}

const ProtectedRoute = ({ requiredCapability }: ProtectedRouteProps) => {
    const { isAuthenticated, hasCapability } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredCapability && !hasCapability(requiredCapability)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
