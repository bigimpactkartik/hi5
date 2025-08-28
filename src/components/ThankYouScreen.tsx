import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { saveFeedback, supabase } from "../lib/supabase"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"
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

    return () => {
      clearTimeout(timer)
    }
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
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
                  "#10b981", // emerald
                  "#06b6d4", // cyan  
                  "#8b5cf6", // violet
                  "#f59e0b", // amber
                  "#ef4444", // red
                  "#ec4899", // pink
                ][Math.floor(Math.random() * 4)],
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-md space-y-6 animate-bounce-in">
        {/* Success Icon */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl mb-4 transform hover:scale-105 transition-all duration-300">
            <span className="text-4xl text-white font-bold">✓</span>
          </div>
        </div>

        {/* Thank You Card */}
        <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-md text-center rounded-3xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 font-[family-name:var(--font-heading)]">Thank You!</h1>
          <p className="text-gray-600 text-lg leading-relaxed font-medium">
            Thank you for sharing your feedback with BIP AI.
          </p>

          {/* Clerk Authentication Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <SignedOut>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-2xl mb-4 border border-purple-200">
                <p className="text-sm text-gray-600 mb-3 font-semibold">Want to track your feedback?</p>
                <SignInButton mode="modal">
                  <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl mb-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-3 font-semibold">Welcome back!</p>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonPopoverCard: "shadow-2xl",
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {isPositiveFeedback && displayText && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl mb-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Your review:</p>
                <p className="text-sm text-gray-800 font-medium">{displayText}</p>
              </div>
              <Button
                onClick={copyToClipboard}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white mb-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              <p className="text-xs text-gray-500 font-medium">Paste this review on Google to support us ⭐</p>
            </div>
          )}

          {!isPositiveFeedback && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-200">
                <p className="text-sm text-gray-700 font-semibold">🎁 Collect your reward at the desk!</p>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {isSaving ? "Saving feedback..." : "Feedback submitted successfully"}
          </p>
          <p className="text-xs text-gray-500 font-medium">Visit us at hi5.com/bipai ✨</p>
        </div>
      </div>
    </div>
  )
}