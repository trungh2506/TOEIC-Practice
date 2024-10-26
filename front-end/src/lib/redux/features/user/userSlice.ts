import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginApi } from "@/api/userApi";
import { ILogin } from "@/interfaces/ILogin";

export const login = createAsyncThunk<string, ILogin>(
  "user/login",
  async (payload: ILogin, { rejectWithValue }) => {
    try {
      const response = await loginApi(payload);
      console.log("login response", response.data);
      const jwt = response.data.access_token;
      // localStorage.setItem("jwt", jwt);
      document.cookie = `jwt=${jwt}; path=/; secure; samesite=strict; max-age=${
        60 * 60 * 24 * 7
      }`; // Cookie sẽ tồn tại trong 7 ngày
      return jwt;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

interface UserState {
  isAuthenticated: boolean;
  jwt: string;
  user: any;
  loading: boolean;
  success: boolean;
  error: boolean;
  message: any;
}

const initialState: UserState = {
  isAuthenticated: false,
  jwt: "",
  user: null,
  loading: false,
  success: false,
  error: false,
  message: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.success = true;
      state.error = false;
      // localStorage.removeItem("jwt");
      document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.message = "";
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.jwt = action.payload;
      state.isAuthenticated = true;
      state.success = true;
      state.error = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
