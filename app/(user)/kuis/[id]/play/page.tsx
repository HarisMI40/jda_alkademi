"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Trophy, Target, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Quiz, QuizOption } from "@/type/formQuestion"
import axios from "axios"
import { useParams } from "next/navigation"


interface QuizResult {
  questionId: string
  selectedAnswers: string[]
  isCorrect: boolean
  timeSpent: number
}



export default function QuizPlay() {
  const [sampleQuiz, setSampleQuiz] = useState<Quiz>();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [results, setResults] = useState<QuizResult[]>([])
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds per question
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [showAnswer, setShowAnswer] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0);
  const {id} = useParams();

  

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/kuis/${id}`);

      setSampleQuiz(response.data)
    }
  
    fetchData()
  }, [])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showAnswer && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showAnswer) {
      handleSubmitAnswer()
    }
  }, [timeLeft, showAnswer, quizCompleted])

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30)
    setQuestionStartTime(Date.now())
    setSelectedAnswers([])
    setShowAnswer(false)
  }, [currentQuestionIndex])


  if(!sampleQuiz) return null;
  
  const currentQuestion = sampleQuiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === sampleQuiz.questions.length - 1

  const handleAnswerSelect = (optionId: string) => {
    if (showAnswer) return

    if (currentQuestion.question_type === "multiple_choice") {
      setSelectedAnswers([optionId])
    } else if (currentQuestion.question_type === "checkbox") {
      setSelectedAnswers((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
      )
    }
  }

  const handleSubmitAnswer = () => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)
    const correctAnswers = currentQuestion.answer_options.filter((opt : QuizOption) => opt.is_right).map((opt : QuizOption) => opt.id.toString())

    let isCorrect = false
    if (currentQuestion.question_type === "multiple_choice") {
      isCorrect = selectedAnswers.length === 1 && correctAnswers.includes(selectedAnswers[0])
    } else if (currentQuestion.question_type === "checkbox") {
      isCorrect =
        selectedAnswers.length === correctAnswers.length && selectedAnswers.every((id) => correctAnswers.includes(id))
    }

    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswers,
      isCorrect,
      timeSpent,
    }

    setResults((prev) => [...prev, result])
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
    setShowAnswer(true)
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizCompleted(true)
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const getOptionStyle = (option: QuizOption) => {
    if (!showAnswer) {
      return selectedAnswers.includes(option.id.toString())
        ? "bg-blue-500 text-white border-blue-500"
        : "bg-white hover:bg-gray-50 border-gray-200"
    }

    if (option.is_right) {
      return "bg-green-500 text-white border-green-500"
    } else if (selectedAnswers.includes(option.id.toString())) {
      return "bg-red-500 text-white border-red-500"
    } else {
      return "bg-gray-100 text-gray-500 border-gray-200"
    }
  }

  const getScoreColor = () => {
    const percentage = (score / sampleQuiz.questions.length) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (quizCompleted) {
    const totalTime = results.reduce((sum, result) => sum + result.timeSpent, 0)
    const correctAnswers = results.filter((result) => result.isCorrect).length
    const percentage = Math.round((correctAnswers / sampleQuiz.questions.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
              <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
              <p className="text-gray-600">Great job finishing the quiz</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className={cn("text-4xl font-bold mb-2", getScoreColor())}>
                  {correctAnswers}/{sampleQuiz.questions.length}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Target className="h-4 w-4" />
                  Correct Answers
                </div>
              </div>

              <div className="text-center">
                <div className={cn("text-4xl font-bold mb-2", getScoreColor())}>{percentage}%</div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Zap className="h-4 w-4" />
                  Accuracy
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-blue-600">{totalTime}s</div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" />
                  Total Time
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold">Question Results</h3>
              {results.map((result, index) => (
                <div key={result.questionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">Question {index + 1}</span>
                  </div>
                  <div className="text-sm text-gray-600">{result.timeSpent}s</div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()} size="lg">
                Take Quiz Again
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                Back to Quiz Builder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 w-full">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-xl font-bold">{sampleQuiz.title}</h1>
              <p className="text-sm opacity-80">
                Question {currentQuestionIndex + 1} of {sampleQuiz.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Score: {score}/{sampleQuiz.questions.length}
              </Badge>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className={cn("font-bold", timeLeft <= 10 ? "text-red-300" : "text-white")}>{timeLeft}s</span>
              </div>
            </div>
          </div>
          <Progress
            value={((currentQuestionIndex + 1) / sampleQuiz.questions.length) * 100}
            className="mt-4 bg-white/20"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">{currentQuestion.question_text}</h2>
              {currentQuestion.question_type === "checkbox" && (
                <p className="text-sm text-gray-600">Select all correct answers</p>
              )}
            </div>

            {(currentQuestion.question_type === "multiple_choice" || currentQuestion.question_type === "checkbox") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentQuestion.answer_options.map((option: QuizOption) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    size="lg"
                    onClick={() => handleAnswerSelect(option.id.toString())}
                    disabled={showAnswer}
                    className={cn(
                      "h-auto p-6 text-left justify-start transition-all duration-200",
                      getOptionStyle(option),
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {currentQuestion.question_type === "multiple_choice" ? (
                        <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                          {selectedAnswers.includes(option.id.toString()) && <div className="w-3 h-3 rounded-full bg-current" />}
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-current rounded flex items-center justify-center">
                          {selectedAnswers.includes(option.id.toString()) && <div className="w-3 h-3 bg-current rounded-sm" />}
                        </div>
                      )}
                      <span className="text-lg text-wrap">{option.options_text}</span>
                      {showAnswer && option.is_right && <CheckCircle className="h-5 w-5 ml-auto" />}
                      {showAnswer && !option.is_right && selectedAnswers.includes(option.id.toString()) && (
                        <XCircle className="h-5 w-5 ml-auto" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}

            <div className="flex justify-center gap-4">
              {!showAnswer ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswers.length === 0}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Submit Answer
                </Button>
              ) : (
                <div className="text-center">
                  <div className="mb-4">
                    {results[results.length - 1]?.isCorrect ? (
                      <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                        <CheckCircle className="h-6 w-6" />
                        <span className="text-lg font-semibold">Correct!</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                        <XCircle className="h-6 w-6" />
                        <span className="text-lg font-semibold">Incorrect</span>
                      </div>
                    )}
                  </div>
                  <Button onClick={handleNextQuestion} size="lg" className="bg-green-600 hover:bg-green-700">
                    {isLastQuestion ? "View Results" : "Next Question"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
