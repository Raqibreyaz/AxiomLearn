import api from "./axios";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "instructor" | "student";
  avatar?: string;
  bio?: string;
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
};
