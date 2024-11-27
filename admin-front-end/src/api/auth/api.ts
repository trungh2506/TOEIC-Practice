import { ILogin } from "@/interface/ILogin";
import axiosInstance from "@/lib/axios/axiosInstance";

export const loginApi = (data: ILogin) =>
  axiosInstance.post("/auth/admin/login", data);

export const profileApi = () => axiosInstance.get("/auth/profile");
