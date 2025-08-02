"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import {
  fetchQuizById,
  // setQuizDetails,
  // addQuestion,
  deleteQuestion,
  updateQuestion,
  addOption,
  deleteOption,
  updateOption,
  setCorrectAnswer,
} from "@/store/quizSlice"

import QuestionEditor from "./_components/QuestionEditor" // Asumsi komponen ini sudah ada
import QuestionPreview from "./_components/QuestionPreview" // Asumsi komponen ini sudah ada
import QuizHeader from "./_components/QuizHeader"
import Header from "./_components/Header"
import AddQuestionButton from "./_components/AddQuestionButton"

export default function QuizBuilderPage() {
  const [previewMode, setPreviewMode] = useState(false)
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const quiz = useSelector((state: RootState) => state.quiz)

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(fetchQuizById(id))
    }
  }, [dispatch, id])

  // Ubah komponen QuestionEditor dan QuestionPreview untuk menerima props dari Redux
  // atau panggil dispatch langsung dari dalam komponen tersebut.
  // Untuk saat ini, kita akan terus passing props.
const handleSaveQuiz = async () => {
    console.log("Saving quiz:", quiz);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        questionCount={quiz.questions.length}
        previewMode={previewMode}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        onSave={handleSaveQuiz}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quiz Header */}
        <QuizHeader previewMode={previewMode} quiz={quiz} />

        {/* Questions */}
        {quiz.questions.map((question, index) =>
          previewMode ? (
            <QuestionPreview key={question.id} question={question} index={index} />
          ) : (
            <QuestionEditor
              key={question.id}
              question={question}
              index={index}
              updateQuestion={(id, updates) => dispatch(updateQuestion({ id, updates }))}
              deleteQuestion={(id) => dispatch(deleteQuestion(id))}
              addOption={(questionId) => dispatch(addOption(questionId))}
              updateOption={(questionId, optionId, updates) => dispatch(updateOption({ questionId, optionId, updates }))}
              deleteOption={(questionId, optionId) => dispatch(deleteOption({ questionId, optionId }))}
              setCorrectAnswer={(questionId, optionId) => dispatch(setCorrectAnswer({ questionId, optionId }))}
            />
          ),
        )}

        {/* Add Question Button */}
        {!previewMode && <AddQuestionButton />}

        {/* Preview Submit Button */}
        {previewMode && quiz.questions.length > 0 && (
          <div className="mt-8">
            <Button size="lg" className="w-full">
              Submit Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

