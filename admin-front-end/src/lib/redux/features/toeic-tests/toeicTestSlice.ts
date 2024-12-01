import {
  deleteToeicTestApi,
  getAllToeicTestApi,
  getPartToeicTestApi,
  getToeicTestByIdApi,
  restoreAfterSoftDeleteApi,
  updateToeicTestApi,
  uploadToeicTestApi,
} from "@/api/toeic-tests/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const DURATION_TEST = 120 * 60;

export const deleteToeicTest = createAsyncThunk<any, any>(
  "toeicTest/deleteToeicTest",
  async (toeic_test_id, { rejectWithValue }) => {
    try {
      const response = await deleteToeicTestApi(toeic_test_id);
      const data = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

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
type ToeicTestData = {
  title: string;
  type: string;
};
export const uploadToeicTest = createAsyncThunk<any, any>(
  "toeicTest/uploadToeicTest",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await uploadToeicTestApi(formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload TOEIC test."
      );
    }
  }
);

export const updateToeicTest = createAsyncThunk<
  any,
  { toeic_test_id: string; formData: FormData },
  { rejectValue: string }
>(
  "toeicTest/updateToeicTest",
  async ({ toeic_test_id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateToeicTestApi(toeic_test_id, formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update TOEIC test."
      );
    }
  }
);

export const restoreToeicTest = createAsyncThunk<
  any,
  { toeic_test_id: string },
  { rejectValue: string }
>(
  "toeicTest/restoreToeicTest",
  async ({ toeic_test_id }, { rejectWithValue }) => {
    try {
      const response = await restoreAfterSoftDeleteApi(toeic_test_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to restore TOEIC test."
      );
    }
  }
);

interface ToeicTest {
  _id: string;
  title: string;
  image: string;
  type: string;
  meta_data: {
    is_deleted: boolean;
  };
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
    resetStatus: (state) => {
      state.success = false;
      state.error = false;
      state.loading = false;
    },
    refreshToeicTest: (state, action) => {
      const { id, is_deleted } = action.payload;
      const testIndex = state.toeicTestList.findIndex(
        (test) => test._id === id
      );
      if (testIndex !== -1) {
        state.toeicTestList[testIndex].meta_data.is_deleted = is_deleted;
      }
    },
    setCurrentToeicTest: (state, action) => {
      state.currentToeicTest = action.payload;
    },
    startTimer: (state, action) => {
      state.timer = action.payload;
      state.isTimerRunning = true;
    },
    stopTimer: (state) => {
      state.isTimerRunning = false;
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

    //Upload Toeic Test
    builder.addCase(uploadToeicTest.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(uploadToeicTest.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
    });
    builder.addCase(uploadToeicTest.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });

    //Update Toeic Test
    builder.addCase(updateToeicTest.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(updateToeicTest.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
    });
    builder.addCase(updateToeicTest.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });

    // Delete Toeic Test
    builder.addCase(deleteToeicTest.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(deleteToeicTest.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
    });
    builder.addCase(deleteToeicTest.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });

    //Restore toeic test
    builder.addCase(restoreToeicTest.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(restoreToeicTest.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
    });
    builder.addCase(restoreToeicTest.rejected, (state, action) => {
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
  startTimer,
  stopTimer,
  resetTimer,
  decrementTimer,
  setSelectedTimer,
  setSelectedPart,
  setIsPractice,
  refreshToeicTest,
  resetStatus,
  setCurrentToeicTest,
} = toeicTestSlice.actions;
export default toeicTestSlice.reducer;
