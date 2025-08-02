export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  type: "multiple_choice" | "checkbox" | "short_answer" | "long_answer"
  question: string
  options: QuizOption[]
  required: boolean
}

export interface Quiz {
  title: string
  description: string
  questions: QuizQuestion[]
}