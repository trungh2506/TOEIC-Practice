import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { googleApi, loginApi, profileApi, registerApi } from "@/api/userApi";
import { ILogin } from "@/interfaces/ILogin";
import { IRegister } from "@/interfaces/IRegister";
import { IUser } from "@/interfaces/IUser";

export const signInWithGoogle = createAsyncThunk<{ jwt: string; user: any }>(
  "user/google",
  async (_, { rejectWithValue }) => {
    try {
      const response = await googleApi();
      const user = response.data.user;
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

export const login = createAsyncThunk<{ jwt: string; user: any }, any>(
  "user/login",
  async (payload: ILogin, { rejectWithValue }) => {
    try {
      const response = await loginApi(payload);
      console.log("r", response);
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

export const register = createAsyncThunk<string, IRegister>(
  "user/register",
  async (payload: IRegister, { rejectWithValue }) => {
    try {
      const response = await registerApi(payload);
      const jwt = response.data.access_token;
      // localStorage.setItem("jwt", jwt);
      document.cookie = `jwt=${jwt}; path=/; secure; samesite=strict; max-age=${
        60 * 60 * 24 * 7
      }`; // Cookie sẽ tồn tại trong 7 ngày
      return jwt;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
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
  message?: any;
}

const initialState: UserState = {
  isAuthenticated: false,
  jwt: "",
  user: null,
  loading: false,
  success: false,
  error: false,
  message: null,
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
      state.success = true;
      state.error = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.message = action.payload;
      console.log(action.payload);
      state.error = true;
    });
    builder.addCase(register.pending, (state) => {
      state.message = "";
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(
      register.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.success = true;
        state.error = false;
      }
    );
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
      state.message = action.payload;
    });
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.message = "pending with fetch user profile";
      state.loading = true;
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
      state.message = "rejected when fetch user profile";
    });
    builder.addCase(signInWithGoogle.pending, (state) => {
      state.message = "pending to sign in wigh google";
      state.loading = true;
    });
    builder.addCase(signInWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.jwt = action.payload.jwt;
      state.isAuthenticated = true;
      state.success = true;
      // console.log(action.payload);
      state.error = false;
    });
    builder.addCase(signInWithGoogle.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = "rejected sign in with google";
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
