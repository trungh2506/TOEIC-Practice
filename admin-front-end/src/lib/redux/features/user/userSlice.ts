import { getAllUserApi } from "@/api/user/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllUser = createAsyncThunk<any, any>(
  "user/getAllUser",
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getAllUserApi(page);
      const data = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

interface UserState {
  userList: any[];
  userDetail: any;
  loading: boolean;
  success: boolean;
  error: boolean;
  message?: any;

  totalPages: number;
  totalUser: number;
  currentPage: any;
}

const initialState: UserState = {
  userList: [],
  userDetail: null,
  loading: false,
  success: false,
  error: false,
  message: null,

  totalPages: 0,
  totalUser: 0,
  currentPage: 1,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUser.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
      state.totalPages = action.payload.totalPages;
      state.totalUser = action.payload.total;
      state.currentPage = action.payload.currentPage;
      state.userList = action.payload.data;
    });
    builder.addCase(getAllUser.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
