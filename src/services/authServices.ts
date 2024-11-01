import axiosInstance from "@/lib/axiosInstance";

export const login = async (email: string, password: string) => {
  return await axiosInstance.post("/auth/login", { email, password });
};

export const register = async (email: string, password: string) => {
  return await axiosInstance.post("/auth/register", { email, password });
};
