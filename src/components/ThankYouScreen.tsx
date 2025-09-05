import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { saveFeedback } from "../lib/supabase"
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react"
import type { FeedbackData } from "../App"

interface ThankYouScreenProps {
  feedbackData: FeedbackData
}

export function ThankYouScreen({ feedbackData }: ThankYouScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showCopyPopup, setShowCopyPopup] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(0)
  const { isSignedIn } = useUser()

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

  // Auto-copy text and start redirect countdown when user signs in
  useEffect(() => {
    if (isSignedIn && displayText) {
      copyTextToClipboard()
      // Add feedback type to URL and redirect to review page
      const redirectUrl = `/redirect/review?type=${feedbackData.type}`
      setTimeout(() => {
        window.location.href = redirectUrl
      }, 2000) // 2 second delay to show thank you message
    }
  }, [isSignedIn, displayText, feedbackData.type])

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

  const copyTextToClipboard = async () => {
    if (displayText) {
      try {
        await navigator.clipboard.writeText(displayText)
        setShowCopyPopup(true)
        setTimeout(() => setShowCopyPopup(false), 3000)
      } catch (error) {
        console.error("Copy failed:", error)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Copy Success Popup */}
      {showCopyPopup && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-up">
          <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Review copied to clipboard!</span>
          </div>
        </div>
      )}

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
                ][Math.floor(Math.random() * 6)],
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-md space-y-6 animate-bounce-in">
        {/* Progress Icon */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl mb-4 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl text-white font-bold">3/3</span>
          </div>
        </div>

        {/* Final Step Card */}
        <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-md text-center rounded-3xl">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Thank You!
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Your feedback has been submitted successfully
          </p>

          <div className="space-y-4">
            {displayText && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-200">
                <p className="text-xs text-gray-600 mb-2 font-medium">Your review:</p>
                <p className="text-sm text-gray-700 leading-relaxed">{displayText}</p>
              </div>
            )}
            
            <SignedOut>
              <div className="space-y-4">
                <p className="text-sm text-gray-700 text-center font-medium">Share your experience publicly</p>
                <SignInButton mode="modal">
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign In & Copy Review ⭐</span>
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
            
            <SignedIn>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-green-700 font-medium">
                      Redirecting to Google Reviews...
                    </p>
                  </div>
                  <p className="text-xs text-green-600 text-center">
                    Your review has been copied to clipboard
                  </p>
                </div>
              </div>
            </SignedIn>
            
            {!isSignedIn && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Your review will be copied and you'll be redirected to Google Reviews
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Completion Message */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            {isSaving ? "Saving feedback..." : "✅ Feedback saved successfully"}
          </p>
        </div>
      </div>
    </div>
  )
}