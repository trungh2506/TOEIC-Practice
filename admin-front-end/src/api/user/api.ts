import axiosInstance from "@/lib/axios/axiosInstance";

const NAMESPACE = "/user";

export const getAllUserApi = (page: number = 1) =>
  axiosInstance.get(`${NAMESPACE}?page=${page}`);

export const getDetailUserApi = (userId: string) =>
  axiosInstance.get(`${NAMESPACE}/${userId}`);

export const softDeleteUserApi = (userId: string) =>
  axiosInstance.delete(`${NAMESPACE}/${userId}`);

export const restoreAfterSoftDeleteApi = (id: string) =>
  axiosInstance.patch(`${NAMESPACE}/restore/${id}`);
