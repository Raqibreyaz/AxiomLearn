import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface RoleRouteProps {
  children: React.ReactNode;
  roles: Array<"owner" | "admin" | "instructor" | "student">;
}

const RoleRoute = ({ children, roles }: RoleRouteProps) => {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
