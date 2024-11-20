import axiosInstance from "@/lib/axios/axiosInstance";

export const submitAnswerApi = (answerData: any) =>
  axiosInstance.post("/user-answer", answerData);

export const getAllResultByUserIdApi = (page: number = 1) =>
  axiosInstance.get(`/user-answer/user?page=${page}`);

export const getAnswerByAnswerIdApi = (answerId: string) =>
  axiosInstance.post(`/user-answer/${answerId}`);

export const startTestApi = (toeic_test_id: string) =>
  axiosInstance.post(`/user-answer/start/${toeic_test_id}`);

export const submitTestApi = (toeic_test_id: string, answers: any[]) =>
  axiosInstance.post(`/user-answer/submit/${toeic_test_id}`, answers);
