import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { saveFeedback } from "../lib/supabase"
import type { FeedbackData } from "../App"

interface ThankYouScreenProps {
  feedbackData: FeedbackData
}

export function ThankYouScreen({ feedbackData }: ThankYouScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const isPositiveFeedback = feedbackData.type === "loved" || feedbackData.type === "liked"
  const displayText = feedbackData.finalText || feedbackData.originalText

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 4000)
    
    // Save feedback to Supabase
    saveFeedbackToDatabase()
    
    return () => clearTimeout(timer)
  }, [])

  const saveFeedbackToDatabase = async () => {
    setIsSaving(true)
    try {
      const result = await saveFeedback(feedbackData)
      if (result.error) {
        console.error('Failed to save feedback:', result.error)
      }
    } catch (error) {
      console.error('Error saving feedback:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = async () => {
    if (!displayText) return

    try {
      await navigator.clipboard.writeText(displayText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Copy failed:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: [
                  "oklch(var(--feedback-loved))",
                  "oklch(var(--feedback-liked))",
                  "oklch(var(--feedback-better))",
                  "oklch(var(--feedback-poor))",
                ][Math.floor(Math.random() * 4)],
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-md space-y-6 animate-bounce-in">
        {/* Success Icon */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-4xl text-white">✓</span>
          </div>
        </div>

        {/* Thank You Card */}
        <Card className="p-8 shadow-lg border-0 bg-card/80 backdrop-blur-sm text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4 font-[family-name:var(--font-heading)]">Thank You!</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Thank you for sharing your feedback with BIP AI.
          </p>

          {isPositiveFeedback && displayText && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground mb-2">Your review:</p>
                <p className="text-sm text-foreground">{displayText}</p>
              </div>
              <Button
                onClick={copyToClipboard}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-3"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              <p className="text-xs text-muted-foreground">Paste this review on Google to support us.</p>
            </div>
          )}

          {!isPositiveFeedback && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">Collect your reward at the desk.</p>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {isSaving ? "Saving feedback..." : "Feedback submitted successfully"}
          </p>
          <p className="text-xs text-muted-foreground">Visit us at hi5.com/bipai</p>
        </div>
      </div>
    </div>
  )
}