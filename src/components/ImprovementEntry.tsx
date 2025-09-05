import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import type { FeedbackData } from "../App"

interface ImprovementEntryProps {
  feedbackData: FeedbackData
  onUpdate: (data: Partial<FeedbackData>) => void
  onNext: () => void
}

export function ImprovementEntry({ feedbackData, onUpdate, onNext }: ImprovementEntryProps) {
  const [text, setText] = useState(feedbackData.originalText || "")
  const [isLoading, setIsLoading] = useState(false)
  const [enhanceReview, setEnhanceReview] = useState(true)
  const [showCharacterWarning, setShowCharacterWarning] = useState(false)

  const isPositiveFeedback = feedbackData.type === "loved" || feedbackData.type === "liked"
  const headerText = isPositiveFeedback ? "What did you love about us?" : "What can we improve?"
  const placeholderText = isPositiveFeedback
    ? "Tell us what you loved about our service..."
    : "Tell us how we can improve our service..."

  const minCharacters = 30
  const isTextTooShort = text.trim().length < minCharacters

  const handleSubmit = async () => {
    if (!text.trim() || isTextTooShort) {
      setShowCharacterWarning(true)
      return
    }

    setIsLoading(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onUpdate({
      originalText: text,
      useAI: enhanceReview,
    })

    setIsLoading(false)
    onNext()
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    if (showCharacterWarning && e.target.value.trim().length >= minCharacters) {
      setShowCharacterWarning(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-md space-y-6 animate-slide-in-up">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{headerText}</h1>
        </div>

        {/* Input Card */}
        <Card className="p-6 shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-3xl">
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder={placeholderText}
                value={text}
                onChange={handleTextChange}
                className="min-h-32 resize-none border-gray-200 rounded-2xl bg-gray-50/30 text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs ${text.trim().length < minCharacters ? 'text-red-500' : 'text-gray-500'}`}>
                  {text.trim().length}/{minCharacters} characters minimum
                </span>
                {showCharacterWarning && (
                  <span className="text-xs text-red-500 font-medium">
                    Please enter at least {minCharacters} characters
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="enhance-review"
                checked={enhanceReview}
                onCheckedChange={(checked) => setEnhanceReview(checked as boolean)}
                className="rounded-md border-2 border-indigo-300 data-[state=checked]:bg-indigo-500"
              />
              <label htmlFor="enhance-review" className="text-sm font-medium text-gray-600 cursor-pointer">
                {isPositiveFeedback ? "Enhance your review" : "Make feedback constructive"}
              </label>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || isTextTooShort || isLoading}
              className="w-full h-12 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}