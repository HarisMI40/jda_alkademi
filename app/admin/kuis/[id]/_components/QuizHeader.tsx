"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { setQuizDetails } from "@/store/quizSlice"
import type { RootState, AppDispatch } from "@/store/store"
import { useDispatch } from "react-redux"

interface QuizHeaderProps {
  previewMode: boolean
  quiz: RootState["quiz"]
}

export default function QuizHeader({ previewMode, quiz }: QuizHeaderProps) {
  const dispatch = useDispatch<AppDispatch>()

  return (
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
                onChange={(e) => dispatch(setQuizDetails({ title: e.target.value }))}
                className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter quiz description"
                value={quiz.description || ""}
                onChange={(e) => dispatch(setQuizDetails({ description: e.target.value }))}
                className="border-0 px-0 focus-visible:ring-0"
                rows={3}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}