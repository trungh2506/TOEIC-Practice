import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/lib/redux/features/user/userSlice";
import toeicTestSlice from "@/lib/redux/features/toeic-test/toeicTestSlice";
import userAnswerSlice from "@/lib/redux/features/user-answer/userAnswerSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      toeicTest: toeicTestSlice,
      userAnswer: userAnswerSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
