import { getAllToeicTestApi, getToeicTestByIdApi } from "@/api/toeicTest-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllToeicTest = createAsyncThunk<any, any>(
  "toeicTest/getAllToeicTest",
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getAllToeicTestApi(page);
      const data = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getToeicTestById = createAsyncThunk<any, any>(
  "toeicTest/getToeicTestById",
  async (toeic_test_id: string, { rejectWithValue }) => {
    try {
      const response = await getToeicTestByIdApi(toeic_test_id);
      const data = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

interface ToeicTest {
  _id: string;
  title: string;
  image: string;
  type: string;
}

interface ToeicTestState {
  //danh sách các bài toeic test
  toeicTestList: ToeicTest[];
  //đề đang thi
  currentToeicTest: any;
  //lưu câu hỏi hiện đang làm của người dùng
  currentQuestion: any;
  //các câu hỏi phần Reading
  readingQuestions: any[];
  //các câu hỏi phần Listening
  listeningQuestions: any[];
  //các bài đọc
  passages: any[];
  //các câu hỏi đánh dấu
  markedQuestions: [];

  //part thi hiện tại
  currentPart: number;

  //pagination
  totalPages: number;
  totalToeicTest: number;
  currentPage: any;

  loading: boolean;
  success: boolean;
  error: boolean;
}

const initialState: ToeicTestState = {
  toeicTestList: [],
  currentToeicTest: null,
  currentQuestion: null,
  readingQuestions: [],
  listeningQuestions: [],
  passages: [],
  markedQuestions: [],
  totalPages: 0,
  totalToeicTest: 0,
  currentPage: 1,
  currentPart: 1,
  loading: false,
  success: false,
  error: false,
};

const toeicTestSlice = createSlice({
  name: "toeicTest",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllToeicTest.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(getAllToeicTest.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
      state.totalPages = action.payload.totalPages;
      state.totalToeicTest = action.payload.total;
      state.currentPage = action.payload.currentPage;
      state.toeicTestList = action.payload.data;
    });
    builder.addCase(getAllToeicTest.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });

    //getToeicTestById
    builder.addCase(getToeicTestById.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(getToeicTestById.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
      state.currentToeicTest = action.payload;
      state.readingQuestions = action.payload.reading;
      state.listeningQuestions = action.payload.listening;
      state.passages = action.payload.passages;
      state.currentPart = 1;
    });
    builder.addCase(getToeicTestById.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });
  },
});

export const { setCurrentPage } = toeicTestSlice.actions;
export default toeicTestSlice.reducer;
