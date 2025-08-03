export interface QuizOption {
  id: number | string
  question_id: number

  options_text: string
  is_right: boolean,
  order?: number
}

export interface QuizQuestion {
  id: string
  question_type: "multiple_choice" | "checkbox" | "short_answer" | "long_answer"
  question_text: string
  answer_options: QuizOption[]
  required: boolean
}

export interface Quiz {
  id : number
  title: string
  description: string
  tag_id : number
  questions: QuizQuestion[]
}

// Definisikan tipe untuk state slice
export interface QuizState extends Quiz {
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}