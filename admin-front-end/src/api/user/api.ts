import axiosInstance from "@/lib/axios/axiosInstance";

export const getAllUserApi = (page: number = 1) =>
  axiosInstance.get(`/user?page=${page}`);

export const getDetailUserApi = (userId: string) =>
  axiosInstance.get(`/user/${userId}`);
