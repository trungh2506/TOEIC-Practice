import axiosInstance from "@/lib/axios/axiosInstance";

export const submitAnswerApi = (answerData: any) =>
  axiosInstance.post("/user-answer", answerData);

export const getAllResultByUserIdApi = (page: number = 1) =>
  axiosInstance.get(`/user-answer/user?page=${page}`);

export const getAnswerByAnswerIdApi = (answerId: string) =>
  axiosInstance.post(`/user-answer/${answerId}`);
