import { QuizQuestion } from "@/type/formQuestion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface QuestionPreviewProps {
  question: QuizQuestion
  index: number
}

export default function QuestionPreview({ question, index }: QuestionPreviewProps) {
  return (
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
            {question.options.map((option:any) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                <Label htmlFor={`${question.id}-${option.id}`}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "checkbox" && (
          <div className="space-y-2">
            {question.options.map((option:any) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox id={`${question.id}-${option.id}`} />
                <Label htmlFor={`${question.id}-${option.id}`}>{option.text}</Label>
              </div>
            ))}
          </div>
        )}

        {question.type === "short-answer" && <Input placeholder="Your answer" />}
        {question.type === "long-answer" && <Textarea placeholder="Your answer" rows={4} />}
      </CardContent>
    </Card>
  )
}