"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Save } from "lucide-react"

interface HeaderProps {
  questionCount: number
  previewMode: boolean
  onTogglePreview: () => void
  onSave: () => void
}

export default function Header({ questionCount, previewMode, onTogglePreview, onSave }: HeaderProps) {
  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Quiz Builder</h1>
            <Badge variant="secondary">{questionCount} questions</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onTogglePreview} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {previewMode ? "Edit" : "Preview"}
            </Button>
            <Button onClick={onSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}