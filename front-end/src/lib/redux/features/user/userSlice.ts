import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginApi, profileApi, registerApi } from "@/api/userApi";
import { ILogin } from "@/interfaces/ILogin";
import { IRegister } from "@/interfaces/IRegister";
import { IUser } from "@/interfaces/IUser";

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

export const register = createAsyncThunk<string, IRegister>(
  "user/register",
  async (payload: IRegister, { rejectWithValue }) => {
    try {
      const response = await registerApi(payload);
      console.log("register response", response.data);
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

export const fetchUserProfile = createAsyncThunk<
  IUser,
  void,
  { rejectValue: string }
>("user/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await profileApi();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error fetching profile"
    );
  }
});

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
      state.message = "";
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    });
    builder.addCase(register.pending, (state) => {
      state.message = "";
      state.loading = true;
    });
    builder.addCase(
      register.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.jwt = action.payload;
        state.isAuthenticated = true;
        state.success = true;
        state.error = false;
      }
    );
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    });
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.message = "";
      state.loading = true;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.success = true;
      state.error = false;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
