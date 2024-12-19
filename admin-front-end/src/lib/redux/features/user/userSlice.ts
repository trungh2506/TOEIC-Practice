import {
  getAllUserApi,
  restoreAfterSoftDeleteApi,
  softDeleteUserApi,
} from "@/api/user/api";
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

export const deleteUser = createAsyncThunk<any, any>(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await softDeleteUserApi(id);
      const data = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const restoreUser = createAsyncThunk<
  any,
  { user_id: string },
  { rejectValue: string }
>("user/restoreUser", async ({ user_id }, { rejectWithValue }) => {
  try {
    const response = await restoreAfterSoftDeleteApi(user_id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to restore User."
    );
  }
});

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
  reducers: {
    refreshUser: (state, action) => {
      const { id, is_deleted } = action.payload;
      const userIndex = state.userList.findIndex((user) => user._id === id);
      if (userIndex !== -1) {
        state.userList[userIndex].meta_data.is_deleted = is_deleted;
      }
    },
  },
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

    //Soft Delete User
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });

    //Restore toeic test
    builder.addCase(restoreUser.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(restoreUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
    });
    builder.addCase(restoreUser.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });
  },
});

export const { refreshUser } = userSlice.actions;
export default userSlice.reducer;
