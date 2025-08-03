import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { Quiz, QuizQuestion, QuizOption, QuizState } from "@/type/formQuestion" // Sesuaikan path jika perlu
import axios from "axios"

const initialState: QuizState = {
  title: "",
  description: "",
  questions: [],
  status: "idle",
  error: null,
}

// Async Thunk untuk mengambil data kuis
export const fetchQuizById = createAsyncThunk("quiz/fetchById", async (id: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/kuis/${id}`)
  return response.data as Quiz
})

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    // Reducer untuk mengubah judul dan deskripsi
    setQuizDetails(state, action: PayloadAction<{ title?: string; description?: string }>) {
      if (action.payload.title !== undefined) state.title = action.payload.title
      if (action.payload.description !== undefined) state.description = action.payload.description
    },
    addQuestion(state) {
      const newQuestion: QuizQuestion = {
        id: Date.now().toString(),
        question_type: "multiple_choice",
        question_text: "",
        answer_options: [
          { id: Date.now().toString() + "1", options_text: "Option 1", is_right: false },
          { id: Date.now().toString() + "2", options_text: "Option 2", is_right: false },
        ],
        required: false,
      }
      state.questions.push(newQuestion)
    },
    deleteQuestion(state, action: PayloadAction<string>) {
      state.questions = state.questions.filter((q) => q.id !== action.payload)
    },
    updateQuestion(state, action: PayloadAction<{ id: string; updates: Partial<QuizQuestion> }>) {
      const question = state.questions.find((q) => q.id === action.payload.id)
      if (question) {
        Object.assign(question, action.payload.updates)
      }
    },
    addOption(state, action: PayloadAction<string>) {
      const question = state.questions.find((q) => q.id === action.payload)
      if (question) {
        const newOption: QuizOption = {
          id: Date.now().toString(),
          options_text: `Option ${question.answer_options.length + 1}`,
          is_right: false,
        }
        question.answer_options.push(newOption)
      }
    },
    deleteOption(state, action: PayloadAction<{ questionId: string; optionId: string }>) {
      const question = state.questions.find((q) => q.id === action.payload.questionId)
      if (question && question.answer_options.length > 2) {
        question.answer_options = question.answer_options.filter((opt) => opt.id !== action.payload.optionId)
      }
    },
    updateOption(state, action: PayloadAction<{ questionId: string; optionId: string; updates: Partial<QuizOption> }>) {
      const question = state.questions.find((q) => q.id === action.payload.questionId)
      const option = question?.answer_options.find((opt) => opt.id === action.payload.optionId)
      if (option) {
        Object.assign(option, action.payload.updates)
      }
    },
    setCorrectAnswer(state, action: PayloadAction<{ questionId: string; optionId: string }>) {
      const question = state.questions.find((q) => q.id === action.payload.questionId)
      if (!question) return

      if (question.question_type === "multiple_choice") {
        question.answer_options.forEach((opt) => {
          opt.is_right = opt.id === action.payload.optionId
        })
      } else if (question.question_type === "checkbox") {
        const option = question.answer_options.find((opt) => opt.id === action.payload.optionId)
        if (option) {
          option.is_right = !option.is_right
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizById.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.title = action.payload.title
        state.description = action.payload.description
        state.questions = action.payload.questions
        // Anda bisa tambahkan state.questions jika API mengembalikannya
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch quiz"
      })
  },
})

export const {
  setQuizDetails,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  addOption,
  deleteOption,
  updateOption,
  setCorrectAnswer,
} = quizSlice.actions

export default quizSlice.reducer