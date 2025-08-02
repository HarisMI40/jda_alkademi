"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useDispatch } from "react-redux"
import { addQuestion } from "@/store/quizSlice"
import type { AppDispatch } from "@/store/store"

export default function AddQuestionButton() {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="pt-6">
        <Button onClick={() => dispatch(addQuestion())} variant="ghost" className="w-full h-16 text-lg">
          <Plus className="h-6 w-6 mr-2" />
          Add Question
        </Button>
      </CardContent>
    </Card>
  )
}