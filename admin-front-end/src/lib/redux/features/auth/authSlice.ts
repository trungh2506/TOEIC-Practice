import { loginApi, profileApi } from "@/api/auth/api";
import { ILogin } from "@/interface/ILogin";
import { IUser } from "@/interface/IUser";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const fetchUserProfile = createAsyncThunk<
  IUser,
  void,
  { rejectValue: string }
>("auth/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await profileApi();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error fetching profile"
    );
  }
});

export const login = createAsyncThunk<{ jwt: string; user: any }, any>(
  "auth/login",
  async (payload: ILogin, { rejectWithValue }) => {
    try {
      const response = await loginApi(payload);
      // console.log(response);
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
      state.message = "Đang xử lý";
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

    // get profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.message = "pending with fetch user profile";
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.success = true;
      state.error = false;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.success = false;
      state.message = "rejected when fetch user profile";
    });
  },
});

function getCookie(name: string): string | undefined {
  const cookieMatch = document.cookie.match(
    "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  return cookieMatch ? cookieMatch.pop() : undefined;
}

export const { logout } = authSlice.actions;
export default authSlice.reducer;
