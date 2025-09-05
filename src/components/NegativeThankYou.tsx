import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { saveFeedback } from "../lib/supabase"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"
import type { FeedbackData } from "../App"

interface NegativeThankYouProps {
  feedbackData: FeedbackData
}

export function NegativeThankYou({ feedbackData }: NegativeThankYouProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
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
            <span className="text-2xl text-white font-bold">✓</span>
          </div>
        </div>

        {/* Thank You Card */}
        <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-md text-center rounded-3xl">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Thank You!
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Your feedback has been submitted successfully. We appreciate your input and will use it to improve our service.
          </p>

          <div className="space-y-4">
            <SignedOut>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">Sign in to complete your feedback</p>
                <SignInButton mode="modal">
                  <button className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Sign In</span>
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
            
            <SignedIn>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-200">
                <p className="text-sm text-gray-700 mb-3 text-center">Feedback completed successfully!</p>
                <div className="flex justify-center">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonPopoverCard: "shadow-xl"
                      }
                    }}
                  />
                </div>
              </div>
            </SignedIn>
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