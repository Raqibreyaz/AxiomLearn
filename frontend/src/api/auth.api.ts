import api from "./axios";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "instructor" | "student";
  avatar?: string;
  bio?: string;
  phone?: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  password?: string;
  newPassword?: string;
}

export const authApi = {
  signup: async (payload: SignupPayload): Promise<AuthUser> => {
    const { data } = await api.post("/auth/signup", payload);
    return data.data.user;
  },

  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const { data } = await api.post("/auth/login", payload);
    return data.data.user;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getMe: async (): Promise<AuthUser> => {
    const { data } = await api.get("/auth/me");
    return data.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<AuthUser> => {
    const { data } = await api.patch("/auth/update", payload);
    return data.data;
  },

  updateAvatar: async (file: File): Promise<void> => {
    await api.post("/auth/avatar", file, {
      headers: { "Content-Type": file.type },
    });
  },

  getUsers: async (): Promise<AuthUser[]> => {
    const { data } = await api.get("/auth/users");
    return data.data;
  },

  updateRole: async (userId: string, role: "instructor" | "student"): Promise<AuthUser> => {
    const { data } = await api.patch(`/auth/users/${userId}/role`, { role });
    return data.data;
  },
};
