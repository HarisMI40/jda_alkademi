"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, GripVertical, Eye, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import axios from "axios"

interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

interface QuizQuestion {
  id: string
  type: "multiple-choice" | "checkbox" | "short-answer" | "long-answer"
  question: string
  options: QuizOption[]
  required: boolean
}

interface Quiz {
  title: string
  description: string
  questions: QuizQuestion[]
}

export default function QuizBuilder() {
  const [quiz, setQuiz] = useState<Quiz>({
    title: "",
    description: "",
    questions: [],
  })

  const [previewMode, setPreviewMode] = useState(false)

  const {id} = useParams();


  useEffect(() => {
    async function fetchData(){
      const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/kuis/${id}`);
      
      console.log(data)
      setQuiz({...quiz, title : data.title, description : data.description});
    }

    fetchData();
  
  }, [])
  

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      type: "multiple-choice",
      question: "",
      options: [
        { id: "1", text: "Option 1", isCorrect: false },
        { id: "2", text: "Option 2", isCorrect: false },
      ],
      required: false,
    }
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
  }

  const updateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
    }))
  }

  const deleteQuestion = (questionId: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }

  const addOption = (questionId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId)
    if (question) {
      const newOption: QuizOption = {
        id: Date.now().toString(),
        text: `Option ${question.options.length + 1}`,
        isCorrect: false,
      }
      updateQuestion(questionId, {
        options: [...question.options, newOption],
      })
    }
  }

  const updateOption = (questionId: string, optionId: string, updates: Partial<QuizOption>) => {
    const question = quiz.questions.find((q) => q.id === questionId)
    if (question) {
      updateQuestion(questionId, {
        options: question.options.map((opt) => (opt.id === optionId ? { ...opt, ...updates } : opt)),
      })
    }
  }

  const deleteOption = (questionId: string, optionId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId)
    if (question && question.options.length > 2) {
      updateQuestion(questionId, {
        options: question.options.filter((opt) => opt.id !== optionId),
      })
    }
  }

  const setCorrectAnswer = (questionId: string, optionId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId)
    if (question) {
      if (question.type === "multiple-choice") {
        // For multiple choice, only one can be correct
        updateQuestion(questionId, {
          options: question.options.map((opt) => ({
            ...opt,
            isCorrect: opt.id === optionId,
          })),
        })
      } else if (question.type === "checkbox") {
        // For checkbox, multiple can be correct
        updateOption(questionId, optionId, {
          isCorrect: !question.options.find((opt) => opt.id === optionId)?.isCorrect,
        })
      }
    }
  }

  const renderQuestionEditor = (question: QuizQuestion, index: number) => (
    <Card key={question.id} className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-4">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
          <Badge variant="outline">{index + 1}</Badge>
          <Select
            value={question.type}
            onValueChange={(value: QuizQuestion["type"]) => updateQuestion(question.id, { type: value })}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              <SelectItem value="checkbox">Checkboxes</SelectItem>
              <SelectItem value="short-answer">Short Answer</SelectItem>
              <SelectItem value="long-answer">Long Answer</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteQuestion(question.id)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Input
          placeholder="Enter your question"
          value={question.question}
          onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
          className="text-lg font-medium"
        />
      </CardHeader>
      <CardContent>
        {(question.type === "multiple-choice" || question.type === "checkbox") && (
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => (
              <div key={option.id} className="flex items-center gap-3">
                <Button
                  variant={option.isCorrect ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCorrectAnswer(question.id, option.id)}
                  className="min-w-[80px]"
                >
                  {option.isCorrect ? "Correct" : "Mark"}
                </Button>
                {question.type === "multiple-choice" ? (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    {option.isCorrect && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center">
                    {option.isCorrect && <div className="w-2 h-2 bg-blue-600 rounded-sm" />}
                  </div>
                )}
                <Input
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option.text}
                  onChange={(e) => updateOption(question.id, option.id, { text: e.target.value })}
                  className="flex-1"
                />
                {question.options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteOption(question.id, option.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="ghost" onClick={() => addOption(question.id)} className="w-full border-2 border-dashed">
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        )}

        {question.type === "short-answer" && <Input placeholder="Short answer text" disabled className="bg-gray-50" />}

        {question.type === "long-answer" && (
          <Textarea placeholder="Long answer text" disabled className="bg-gray-50" rows={4} />
        )}

        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Checkbox
            checked={question.required}
            onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
          />
          <Label>Required</Label>
        </div>
      </CardContent>
    </Card>
  )

  const renderQuestionPreview = (question: QuizQuestion, index: number) => (
    <Card key={question.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">
            {index + 1}. {question.question || "Untitled Question"}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h3>
        </div>

        {question.type === "multiple-choice" && (
          <RadioGroup>
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} />
                <Label>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "checkbox" && (
          <div className="space-y-2">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox />
                <Label>{option.text}</Label>
              </div>
            ))}
          </div>
        )}

        {question.type === "short-answer" && <Input placeholder="Your answer" />}

        {question.type === "long-answer" && <Textarea placeholder="Your answer" rows={4} />}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Quiz Builder</h1>
              <Badge variant="secondary">{quiz.questions.length} questions</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {previewMode ? "Edit" : "Preview"}
              </Button>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quiz Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            {previewMode ? (
              <div>
                <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
                {quiz.description && <p className="text-gray-600 text-lg">{quiz.description}</p>}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter quiz title"
                    value={quiz.title}
                    onChange={(e) => setQuiz((prev) => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter quiz description"
                    value={quiz.description}
                    onChange={(e) => setQuiz((prev) => ({ ...prev, description: e.target.value }))}
                    className="border-0 px-0 focus-visible:ring-0"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questions */}
        {quiz.questions.map((question, index) =>
          previewMode ? renderQuestionPreview(question, index) : renderQuestionEditor(question, index),
        )}

        {/* Add Question Button */}
        {!previewMode && (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6">
              <Button onClick={addQuestion} variant="ghost" className="w-full h-16 text-lg">
                <Plus className="h-6 w-6 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        )}

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
