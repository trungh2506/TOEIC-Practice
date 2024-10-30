import axiosInstance from "@/lib/axios/axiosInstance";

export const getAllToeicTestApi = (page: number = 1) =>
  axiosInstance.get(`/toeic-test?page=${page}`);

export const getToeicTestByIdApi = (id: string) =>
  axiosInstance.get(`/toeic-test/${id}`);

export const getPartToeicTestApi = (id: string, part_number: number) =>
  axiosInstance.get(`/toeic-test/${id}/part/${part_number}`);

export const uploadToeicTestApi = (toeic_test_data: any, files: File) => {
  axiosInstance.post(`/toeic-test`, toeic_test_data);
};
