import {
  getAllToeicTestApi,
  getPartToeicTestApi,
  getToeicTestByIdApi,
} from "@/api/toeicTest-api";
import { startTestApi } from "@/api/userAnswer-api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const DURATION_TEST = 120 * 60;

export const getPartToeicTest = createAsyncThunk<
  any,
  { toeic_test_id: string; part_number: number }
>(
  "toeicTest/getPartToeicTest",
  async ({ toeic_test_id, part_number }, { rejectWithValue }) => {
    try {
      const response = await getPartToeicTestApi(toeic_test_id, part_number);
      const data = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

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
  filteredToeicTest: any;
  //lưu câu hỏi hiện đang làm của người dùng
  currentQuestion: any;

  //part thi hiện tại
  currentPart: number;

  //part mà người dùng chọn trong practice
  selectedPart: number;

  //thời gian người dùng lựa chọn trong practice
  selectedTimer: number;
  isPractice: boolean;

  //tùy chọn hiển thị câu trả lời
  isAnswerShowing: boolean;

  //pagination
  totalPages: number;
  totalToeicTest: number;
  currentPage: any;

  loading: boolean;
  success: boolean;
  error: boolean;

  //timer
  timer: number;
  isTimerRunning: boolean;
}

const initialState: ToeicTestState = {
  toeicTestList: [],
  currentToeicTest: null,
  filteredToeicTest: null,
  currentQuestion: null,
  totalPages: 0,
  totalToeicTest: 0,
  currentPage: 1,
  currentPart: 1,
  selectedPart: 0,
  selectedTimer: 0,
  isAnswerShowing: false,
  isPractice: false,
  loading: false,
  success: false,
  error: false,

  timer: 0,
  isTimerRunning: false,
};

const toeicTestSlice = createSlice({
  name: "toeicTest",
  initialState,
  reducers: {
    startTimer: (state, action) => {
      state.timer = action.payload;
      state.isTimerRunning = true;
    },
    stopTimer: (state) => {
      state.isTimerRunning = false;
    },
    setTimer: (state, action) => {
      state.timer = action.payload;
    },
    resetTimer: (state, action) => {
      state.timer = action.payload;
      state.isTimerRunning = false;
    },
    decrementTimer: (state) => {
      if (state.timer > 0) {
        state.timer -= 1;
      } else {
        state.isTimerRunning = false;
      }
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedPart: (state, action) => {
      state.selectedPart = action.payload;
    },
    setSelectedTimer: (state, action) => {
      state.selectedTimer = action.payload;
    },
    setIsPractice: (state, action) => {
      state.isPractice = action.payload;
    },
    setIsAnswerShowing: (state, action) => {
      state.isAnswerShowing = action.payload;
    },
    increaseCurrentPart: (state) => {
      state.currentPart += 1;
    },
    filterByPart: (state, action: PayloadAction<number>) => {
      state.filteredToeicTest = {
        listening: state.currentToeicTest?.listening?.filter(
          (question: any) => question.part === action.payload
        ),
        reading: state.currentToeicTest?.reading?.filter(
          (question: any) => question.part === action.payload
        ),
        passages: state.currentToeicTest?.passages?.filter(
          (passage: any) => passage.part === action.payload
        ),
      };
    },
    navigateToSelectedQuestion: (state, action: PayloadAction<number>) => {
      let part: number = 0;
      const questionNumber = action.payload;
      const allQuestions = [
        ...state.currentToeicTest.listening,
        ...state.currentToeicTest.reading,
      ];
      // Tìm câu hỏi với question_number tương ứng
      const foundQuestion = allQuestions.find(
        (question: any) => question.question_number === questionNumber
      );

      // Nếu tìm thấy câu hỏi, lấy ra part và gọi lại hàn filterByPart
      if (foundQuestion) {
        part = foundQuestion.part;
        state.filteredToeicTest = {
          listening: state.currentToeicTest?.listening?.filter(
            (question: any) => question.part === part
          ),
          reading: state.currentToeicTest?.reading?.filter(
            (question: any) => question.part === part
          ),
          passages: state.currentToeicTest?.passages?.filter(
            (passage: any) => passage.part === part
          ),
        };
      }
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
      state.currentPart = 1;
    });
    builder.addCase(getToeicTestById.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });

    //Get Part Toeic Test
    builder.addCase(getPartToeicTest.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(getPartToeicTest.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
      state.currentToeicTest = action.payload;
    });
    builder.addCase(getPartToeicTest.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });
  },
});

export const {
  setCurrentPage,
  increaseCurrentPart,
  filterByPart,
  navigateToSelectedQuestion,
  setIsAnswerShowing,
  startTimer,
  stopTimer,
  resetTimer,
  setTimer,
  decrementTimer,
  setSelectedTimer,
  setSelectedPart,
  setIsPractice,
} = toeicTestSlice.actions;
export default toeicTestSlice.reducer;
