import authSlice from "@/lib/redux/features/auth/authSlice";
import toeicTestSlice from "@/lib/redux/features/toeic-tests/toeicTestSlice";
import userSlice from "@/lib/redux/features/user/userSlice";
import { configureStore } from "@reduxjs/toolkit";

export const makeStore = () => {
  return configureStore({
    reducer: { auth: authSlice, toeicTests: toeicTestSlice, user: userSlice },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
