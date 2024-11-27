import {
  cancelTestApi,
  getAllResultByUserIdApi,
  resumeTestApi,
  saveTestApi,
  startTestApi,
  submitPracticeAnswerApi,
  submitTestApi,
} from "@/api/userAnswer-api";
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

const STATUS_CORRECT = "correct";
const STATUS_INCORRECT = "incorrect";
const STATUS_UNANSWERED = "unanswered";

export const getAllUserAnswer = createAsyncThunk<any, any>(
  "userAnswer/getAllUserAnswer",
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getAllResultByUserIdApi(page);
      console.log(response.data);
      const data = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

interface StartTestErrorPayload {
  message: string;
  onGoingTest: any; // hoặc kiểu chính xác của bài thi đang thực hiện
}

export const startTest = createAsyncThunk<
  any,
  string,
  { rejectValue: StartTestErrorPayload }
>("userAnswer/startTest", async (toeic_test_id, { rejectWithValue }) => {
  try {
    const response = await startTestApi(toeic_test_id);
    return response.data; // trả về dữ liệu thành công
  } catch (error: any) {
    // Xử lý lỗi và trả về thông tin message, onGoingTest
    return rejectWithValue({
      message: error.response?.data?.message || "Đã xảy ra lỗi",
      onGoingTest: error.response?.data?.onGoingTest || null,
    });
  }
});

export const submitPracticeAnswer = createAsyncThunk<any, any>(
  "userAnswer/submitPracticeAnswer",
  async (answerData: any, { rejectWithValue }) => {
    try {
      const response = await submitPracticeAnswerApi(answerData);
      const data = response.data;
      console.log("data when submit answer", data);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const submitTest = createAsyncThunk<any, any>(
  "userAnswer/submitTest",
  async ({ toeic_test_id, answers }, { rejectWithValue }) => {
    try {
      const response = await submitTestApi(toeic_test_id, answers);
      const data = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const saveTest = createAsyncThunk<any, any>(
  "userAnswer/saveTest",
  async ({ toeic_test_id, answers }, { rejectWithValue }) => {
    try {
      const response = await saveTestApi(toeic_test_id, answers);
      const data = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const resumeTest = createAsyncThunk<any, any>(
  "userAnswer/resumeTest",
  async (toeic_test_id, { rejectWithValue }) => {
    try {
      const response = await resumeTestApi(toeic_test_id);
      const data = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const cancelTest = createAsyncThunk<any, any>(
  "userAnswer/cancelTest",
  async (user_answer_id, { rejectWithValue }) => {
    try {
      const response = await cancelTestApi(user_answer_id);
      const data = response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export interface Answer {
  question_id: string;
  selected_option: string;
  status: string;
}

interface UserAnswer {
  user_id: string;
  toeic_test_id: string;
  answers: Answer[];
  correct_answers: number;
  incorrect_answers: number;
  unanswered_answers: number;
  date_answer: Date;
  score: number;
  duration: number;
}

interface UserAnswerState {
  userAnswerList: UserAnswer[];
  currentUserAnswer: any;
  answers: Answer[];

  //thời gian làm bài nhận từ sv
  test_duration: number;

  //pagination
  totalPages: number;
  totalToeicTest: number;
  currentPage: any;

  //danh sách question_number các câu hỏi mà người dùng đã trả lời để đánh dấu câu hỏi đó là đã làm
  questionNumberList: number[];
  //các câu hỏi người dùng đánh dấu
  markedQuestions: number[];
  loading: boolean;
  success: boolean;
  error: boolean;
  message: string;
  onGoingTest: any[];
}

const initialState: UserAnswerState = {
  userAnswerList: [],
  questionNumberList: [],
  markedQuestions: [],
  currentUserAnswer: null,
  answers: [],
  totalPages: 0,
  totalToeicTest: 0,
  test_duration: 0,
  currentPage: 1,
  loading: false,
  success: false,
  error: false,
  message: "",
  onGoingTest: [],
};

const userAnswerSlice = createSlice({
  name: "userAnswer",
  initialState,
  reducers: {
    addMarkedQuestions: (state, action) => {
      const question = action.payload;

      if (!Array.isArray(state.markedQuestions)) {
        state.markedQuestions = [];
      }

      if (state.markedQuestions.includes(question)) {
        state.markedQuestions = state.markedQuestions.filter(
          (q) => q !== question
        );
      } else {
        state.markedQuestions.push(question);
      }
    },
    addQuestionNumberList: (state, action) => {
      if (state.questionNumberList.length === 0) {
        state.questionNumberList = [
          ...state.questionNumberList,
          action.payload,
        ];
      } else {
        if (!state.questionNumberList?.includes(action.payload))
          state.questionNumberList = [
            ...state.questionNumberList,
            action.payload,
          ];
      }
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    addAnswer: (state, action) => {
      const existingAnswerIndex = state.answers.findIndex(
        (answer) => answer.question_id === action.payload.question_id
      );

      if (existingAnswerIndex === -1) {
        // Nếu không tìm thấy câu hỏi, thêm vào answers
        state.answers.push(action.payload);
      } else {
        // Nếu đã có câu hỏi rồi, cập nhật selected_option
        state.answers[existingAnswerIndex].selected_option =
          action.payload.selected_option;
      }
      console.log("answer của người dùng: ", current(state.answers));
    },
    setAnswers: (state, action) => {
      state.answers = action.payload;
    },
    setQuestionNumberList: (state, action) => {
      state.questionNumberList = action.payload;
    },
    setmarkedQuestions: (state, action) => {
      state.markedQuestions = action.payload;
    },
    clearAnswer: (state) => {
      state.answers = [];
      state.markedQuestions = [];
      state.questionNumberList = [];
    },
    clearCurrentUserAnswer: (state) => {
      state.currentUserAnswer = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUserAnswer.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(getAllUserAnswer.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
      state.totalPages = action.payload.totalPages;
      state.totalToeicTest = action.payload.total;
      state.currentPage = action.payload.currentPage;
      state.userAnswerList = action.payload.data;
    });
    builder.addCase(getAllUserAnswer.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });

    //submit practice test
    builder.addCase(submitPracticeAnswer.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(submitPracticeAnswer.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
      state.currentUserAnswer = action.payload;
    });
    builder.addCase(submitPracticeAnswer.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });

    //submit test
    builder.addCase(submitTest.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(submitTest.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
      state.currentUserAnswer = action.payload;
    });
    builder.addCase(submitTest.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });

    //save temporary test
    builder.addCase(saveTest.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(saveTest.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
      state.currentUserAnswer = action.payload;
    });
    builder.addCase(saveTest.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });

    //start test
    builder.addCase(startTest.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(startTest.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
      state.test_duration = action.payload.duration;
      state.message = action.payload.message;
    });
    builder.addCase(startTest.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
      console.log(action.payload);
      state.message = action.payload?.message || "Đã có bài thi đang thực hiện";
      state.onGoingTest = action.payload?.onGoingTest || null;
    });

    //cancel test
    builder.addCase(cancelTest.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(cancelTest.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
    });
    builder.addCase(cancelTest.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });

    //resume test
    builder.addCase(resumeTest.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    });
    builder.addCase(resumeTest.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
      state.message = action.payload.message;
      state.test_duration = action.payload.duration;
      state.questionNumberList = action.payload.questionNumberList;
    });
    builder.addCase(resumeTest.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
    });
  },
});

export const {
  addAnswer,
  setCurrentPage,
  clearAnswer,
  clearCurrentUserAnswer,
  addQuestionNumberList,
  addMarkedQuestions,
  setAnswers,
  setQuestionNumberList,
  setmarkedQuestions,
} = userAnswerSlice.actions;
export default userAnswerSlice.reducer;
