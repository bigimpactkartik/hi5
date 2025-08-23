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

  const isPositiveFeedback = feedbackData.type === "loved" || feedbackData.type === "liked"
  const headerText = isPositiveFeedback ? "What did you love about us?" : "What can we improve?"
  const placeholderText = isPositiveFeedback
    ? "Tell us what you loved about our service..."
    : "Tell us how we can improve our service..."

  const handleSubmit = async () => {
    if (!text.trim()) return

    setIsLoading(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!isPositiveFeedback) {
      onUpdate({
        originalText: text,
        useAI: false,
        finalText: text,
      })
    } else {
      onUpdate({
        originalText: text,
        useAI: enhanceReview,
      })
    }

    setIsLoading(false)
    onNext()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      <div className="w-full max-w-md space-y-6 animate-slide-in-up">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-[family-name:var(--font-heading)]">{headerText}</h1>
        </div>

        {/* Input Card */}
        <Card className="p-6 shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-3xl">
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder={placeholderText}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-32 resize-none border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-2xl bg-gray-50/50 transition-all duration-200"
              />
            </div>

            {isPositiveFeedback && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enhance-review"
                  checked={enhanceReview}
                  onCheckedChange={(checked) => setEnhanceReview(checked as boolean)}
                  className="rounded-md border-2 border-blue-300 data-[state=checked]:bg-blue-500"
                />
                <label htmlFor="enhance-review" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Enhance your review
                </label>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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