import axiosInstance from "@/lib/axios/axiosInstance";

export const submitAnswerApi = (answerData: any) =>
  axiosInstance.post("/user-answer", answerData);

export const getAllResultByUserIdApi = () => {
  axiosInstance.get("/user-answer/user");
};

export const getAnswerByAnswerIdApi = (answerId: string) => {
  axiosInstance.post(`/user-answer/${answerId}`);
};
