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
  const [isSaving, setIsSaving] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

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

  const handleLeaveReview = async () => {
    setIsCopying(true)
    
    // Copy to clipboard first with animation
    if (displayText) {
      try {
        await navigator.clipboard.writeText(displayText)
        // Show copying animation for 1 second
        setTimeout(() => {
          setIsCopying(false)
          // Then open Google review page
          window.open('https://g.page/r/CRrF1teEyCrUEAE/review', '_blank')
        }, 1000)
      } catch (error) {
        console.error("Copy failed:", error)
        setIsCopying(false)
        // Still open review page even if copy fails
        window.open('https://g.page/r/CRrF1teEyCrUEAE/review', '_blank')
      }
    } else {
      setIsCopying(false)
      window.open('https://g.page/r/CRrF1teEyCrUEAE/review', '_blank')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
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
        {/* Progress Icon */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl mb-4 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl text-white font-bold">3/3</span>
          </div>
        </div>

        {/* Final Step Card */}
        <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-md text-center rounded-3xl">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 font-[family-name:var(--font-heading)]">Almost Done!</h1>
          <p className="text-gray-600 text-sm leading-relaxed font-medium mb-6">
            One final step to complete your feedback journey
          </p>

          {/* Main Action Section - Only for positive feedback */}
          {isPositiveFeedback && (
            <div className="space-y-4">
              {displayText && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-200">
                  <p className="text-xs text-gray-600 mb-2 font-semibold">Your review:</p>
                  <p className="text-sm text-gray-800 font-medium leading-relaxed">{displayText}</p>
                </div>
              )}
              
              <SignedOut>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 text-center font-semibold">Share your experience publicly</p>
                  <SignInButton 
                    mode="modal"
                    forceRedirectUrl={import.meta.env.VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL}
                  >
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Sign In & Leave Google Review ⭐</span>
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              
              <SignedIn>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-200">
                    <p className="text-sm text-gray-700 mb-3 font-semibold text-center">Ready to share your experience?</p>
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
                  </div>
                  <Button
                    onClick={handleLeaveReview}
                    disabled={isCopying}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 py-4"
                  >
                    {isCopying ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Copying Review...</span>
                      </div>
                    ) : (
                      "Leave Google Review ⭐"
                    )}
                  </Button>
                </div>
              </SignedIn>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  {isCopying ? "✅ Review copied to clipboard!" : "Your review will be automatically copied for easy pasting"}
                </p>
              </div>
            </div>
          )}

          {!isPositiveFeedback && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-4">Your feedback helps us improve our service</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                <p className="text-lg text-gray-800 font-bold mb-2">🎁 Collect Your Reward!</p>
                <p className="text-sm text-gray-600">Visit our front desk to claim your special thank-you gift</p>
              </div>
            </div>
          )}


          {!isPositiveFeedback && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
                <p className="text-sm text-gray-700 font-semibold">🎁 Collect your reward at the desk!</p>
              </div>
            </div>
          )}
        </Card>

        {/* Completion Message */}
        {isPositiveFeedback && (
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              {isSaving ? "Saving feedback..." : "✅ Feedback saved successfully"}
            </p>
          </div>
        )}

        {!isPositiveFeedback && (
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              {isSaving ? "Saving feedback..." : "✅ Thank you for your valuable feedback"}
            </p>
            <p className="text-xs text-gray-500 font-medium">Visit us at hi5.com/bipai ✨</p>
          </div>
        )}
      </div>
    </div>
  )
}