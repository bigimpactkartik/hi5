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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md space-y-6 animate-slide-in-up">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-heading)]">{headerText}</h1>
        </div>

        {/* Input Card */}
        <Card className="p-6 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder={placeholderText}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-32 resize-none border-border/50 focus:border-primary rounded-xl"
              />
            </div>

            {isPositiveFeedback && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enhance-review"
                  checked={enhanceReview}
                  onCheckedChange={(checked) => setEnhanceReview(checked as boolean)}
                  className="rounded-md"
                />
                <label htmlFor="enhance-review" className="text-sm font-medium text-foreground cursor-pointer">
                  Enhance your review
                </label>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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