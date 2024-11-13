import { loginApi } from "@/api/auth/api";
import { ILogin } from "@/interface/ILogin";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const login = createAsyncThunk<{ jwt: string; user: any }, any>(
  "auth/login",
  async (payload: ILogin, { rejectWithValue }) => {
    try {
      const response = await loginApi(payload);
      console.log(response);
      const user = response.data.user;
      const jwt = response.data.access_token;
      // localStorage.setItem("jwt", jwt);
      document.cookie = `jwt=${jwt}; path=/; secure; samesite=strict; max-age=${
        60 * 60 * 24 * 7
      }`; // Cookie sẽ tồn tại trong 7 ngày
      return { jwt, user };
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  jwt: string;
  user: any;
  loading: boolean;
  success: boolean;
  error: boolean;
  message?: any;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAdmin: false,
  jwt: "",
  user: null,
  loading: false,
  success: false,
  error: false,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.success = true;
      state.error = false;
      document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie =
        "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.message = "";
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.jwt = action.payload.jwt;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.user?.role === "admin" ? true : false;
      state.success = true;
      state.error = false;
    });
    builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.success = false;
      state.message = action.payload;
      state.error = true;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
