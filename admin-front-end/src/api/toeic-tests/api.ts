import axiosInstance from "@/lib/axios/axiosInstance";

const NAMESPACE = "/toeic-test";

export const getAllToeicTestApi = (page: number = 1) =>
  axiosInstance.get(`${NAMESPACE}/admin?page=${page}`);

export const getToeicTestByIdApi = (id: string) =>
  axiosInstance.get(`${NAMESPACE}/${id}`);

export const getPartToeicTestApi = (id: string, part_number: number) =>
  axiosInstance.get(`${NAMESPACE}/${id}/part/${part_number}`);

export const uploadToeicTestApi = (formData: FormData) => {
  return axiosInstance.post(`${NAMESPACE}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 600000, //10 phút
  });
};

export const updateToeicTestApi = (id: string, formData: FormData) => {
  return axiosInstance.patch(`${NAMESPACE}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 600000, //10 phút
  });
};

export const deleteToeicTestApi = (id: string) =>
  axiosInstance.delete(`${NAMESPACE}/${id}`);

export const restoreAfterSoftDeleteApi = (id: string) =>
  axiosInstance.patch(`${NAMESPACE}/restore/${id}`);
