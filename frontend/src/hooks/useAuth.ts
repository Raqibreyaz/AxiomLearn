import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const { user, isInitialized, setUser, setInitialized, clearUser } =
    useAuthStore();

  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!queryLoading) {
      if (data) {
        setUser(data);
      } else {
        clearUser();
      }
      setInitialized(true);
    }
  }, [data, queryLoading, setUser, clearUser, setInitialized]);

  const isAuthenticated = !!user;
  const isInstructor = user?.role === "instructor" || user?.role === "admin" || user?.role === "owner";
  const isAdmin = user?.role === "admin" || user?.role === "owner";

  return {
    user,
    isLoading: queryLoading && !isInitialized,
    isInitialized,
    isAuthenticated,
    isInstructor,
    isAdmin,
    setUser,
    clearUser,
  };
};
