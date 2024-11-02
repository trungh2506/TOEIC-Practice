import { getAllResultByUserIdApi } from "@/api/userAnswer-api";
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

  //pagination
  totalPages: number;
  totalToeicTest: number;
  currentPage: any;

  loading: boolean;
  success: boolean;
  error: boolean;
}

const initialState: UserAnswerState = {
  userAnswerList: [],
  currentUserAnswer: null,
  answers: [],

  totalPages: 0,
  totalToeicTest: 0,
  currentPage: 1,
  loading: false,
  success: false,
  error: false,
};

const userAnswerSlice = createSlice({
  name: "userAnswer",
  initialState,
  reducers: {
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
  },
});

export const { addAnswer, setCurrentPage } = userAnswerSlice.actions;
export default userAnswerSlice.reducer;
