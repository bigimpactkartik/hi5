"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { FeedbackData } from "@/app/page"

interface ReviewConfirmationProps {
  feedbackData: FeedbackData
  onUpdate: (data: Partial<FeedbackData>) => void
  onNext: () => void
}

export function ReviewConfirmation({ feedbackData, onUpdate, onNext }: ReviewConfirmationProps) {
  const [isAccurate, setIsAccurate] = useState(feedbackData.isAccurate ?? true)

  const handleSubmit = () => {
    onUpdate({ isAccurate })
    onNext()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md space-y-6 animate-slide-in-up">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-heading)]">
            What can we do Better?
          </h1>
        </div>

        {/* Review Card */}
        <Card className="p-6 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">
                {feedbackData.useAI ? "AI-refined feedback:" : "Your feedback:"}
              </p>
              <p className="text-foreground leading-relaxed">
                {feedbackData.aiRefinedText || feedbackData.originalText}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="accurate"
                checked={isAccurate}
                onCheckedChange={(checked) => setIsAccurate(checked as boolean)}
                className="rounded-md"
              />
              <label
                htmlFor="accurate"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Yes! this feedback is accurate
              </label>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Submit
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
