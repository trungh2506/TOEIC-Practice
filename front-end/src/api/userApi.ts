import { ILogin } from "@/interfaces/ILogin";
import { IRegister } from "@/interfaces/IRegister";
import axiosInstance from "@/lib/axios/axiosInstance";

export const loginApi = (data: ILogin) =>
  axiosInstance.post("/auth/login", data);
export const googleApi = () => axiosInstance.get("/auth/google");
export const registerApi = (data: IRegister) =>
  axiosInstance.post("/auth/register", data);
export const profileApi = () => axiosInstance.get("/auth/profile");
