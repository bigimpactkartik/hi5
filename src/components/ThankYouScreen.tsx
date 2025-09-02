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

          {/* Clerk Authentication Section - Only for positive feedback */}
          {isPositiveFeedback && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <SignedOut>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center font-medium">Sign in to track your feedback</p>
                  <SignInButton 
                    mode="modal" 
                    forceRedirectUrl="https://www.google.com/maps/place//data=!4m3!3m2!1s0x3bae15002b9f9977:0xd42ac884d7d6c51a!12e1?source=g.page.m._&laa=merchant-review-solicitation"
                  >
                    <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-300 flex items-center justify-center space-x-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Sign in & Leave Review</span>
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl mb-4 border border-green-200">
                  <p className="text-sm text-gray-600 mb-3 font-semibold text-center">Welcome back!</p>
                  <div className="flex justify-center">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                        userButtonPopoverCard: "shadow-2xl",
                      }
                    }}
                  />
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => window.open('https://www.google.com/maps/place//data=!4m3!3m2!1s0x3bae15002b9f9977:0xd42ac884d7d6c51a!12e1?source=g.page.m._&laa=merchant-review-solicitation', '_blank')}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Leave Google Review ⭐
                    </Button>
                  </div>
                </div>
              </SignedIn>
            </div>
          )}

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