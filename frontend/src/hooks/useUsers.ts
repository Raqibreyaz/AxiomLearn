import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => authApi.getUsers(),
  });
};

export const useUpdateUserRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "instructor" | "student" }) =>
      authApi.updateRole(userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
