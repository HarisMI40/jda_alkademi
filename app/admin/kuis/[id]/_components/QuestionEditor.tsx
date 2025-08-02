import { QuizQuestion } from "@/type/formQuestion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface QuestionEditorProps {
  question: QuizQuestion
  index: number
  updateQuestion: (id: string, updates: Partial<QuizQuestion>) => void
  deleteQuestion: (id: string) => void
  addOption: (questionId: string) => void
  updateOption: (questionId: string, optionId: string, updates: Partial<any>) => void
  deleteOption: (questionId: string, optionId: string) => void
  setCorrectAnswer: (questionId: string, optionId: string) => void
}

export default function QuestionEditor({
  question,
  index,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOption,
  deleteOption,
  setCorrectAnswer,
}: QuestionEditorProps) {
  return (
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
              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              <SelectItem value="checkbox">Checkboxes</SelectItem>
              <SelectItem value="short_answer">Short Answer</SelectItem>
              <SelectItem value="long_answer">Long Answer</SelectItem>
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
        {(question.type === "multiple_choice" || question.type === "checkbox") && (
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

        {question.type === "short_answer" && <Input placeholder="Short answer text" disabled className="bg-gray-50" />}

        {question.type === "long_answer" && (
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
}