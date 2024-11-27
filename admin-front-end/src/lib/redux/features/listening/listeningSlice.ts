import { createSlice } from "@reduxjs/toolkit";

interface ListeningTestState {
  //danh sách các bài toeic test
  listeningTests: any[];
  //đề đang thi
  currentListeningTest: any;
  blank_words: string[];
  questions: any[];
  modifyConversation: string;
  //pagination
  totalPages: number;
  totalToeicTest: number;
  currentPage: any;

  loading: boolean;
  success: boolean;
  error: boolean;
}

const initialState: ListeningTestState = {
  listeningTests: [],
  currentListeningTest: null,
  questions: [],
  blank_words: [],
  totalPages: 0,
  totalToeicTest: 0,
  currentPage: 1,
  modifyConversation: "",
  loading: false,
  success: false,
  error: false,
};

const listeningSlice = createSlice({
  name: "toeicTest",
  initialState,
  reducers: {
    addQuestion: (state, action) => {
      state.questions = [...state.questions, action.payload];
    },
    removeQuestion: (state, action) => {
      state.questions.splice(action.payload.index, 1);
    },
    updateQuestion: (state, action) => {
      const { index, updatedQuestion } = action.payload;
      if (index >= 0 && index < state.questions.length) {
        state.questions[index] = updatedQuestion;
      }
    },
    clearQuestions: (state) => {
      state.questions = [];
    },

    addBlankWord: (state, action) => {
      if (!state.blank_words.includes(action.payload)) {
        state.blank_words = [...state.blank_words, action.payload]; // Nếu chưa tồn tại, thêm vào
      }
    },
    removeBlankWord: (state, action) => {
      state.blank_words.splice(action.payload.index, 1);
    },
    updateBlankWord: (state, action) => {
      const { index, updatedBlankWord } = action.payload;
      if (index >= 0 && index < state.blank_words.length) {
        state.blank_words[index] = updatedBlankWord;
      }
    },
    clearBlankWords: (state) => {
      state.blank_words = [];
    },
    setModifyConversation: (state, action) => {
      state.modifyConversation = action.payload;
    },
    replaceWithUnderLine: (state, action) => {
      const regex = new RegExp(`\\b${action.payload}\\b`, "i");
      const replacement = "_".repeat(action.payload.length);
      state.modifyConversation = state.modifyConversation.replace(
        regex,
        replacement
      );
    },
  },
  extraReducers: () => {},
});

export const {
  addQuestion,
  removeQuestion,
  clearQuestions,
  updateQuestion,
  addBlankWord,
  removeBlankWord,
  clearBlankWords,
  updateBlankWord,
  setModifyConversation,
  replaceWithUnderLine,
} = listeningSlice.actions;
export default listeningSlice.reducer;
