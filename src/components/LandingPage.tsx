import { Button } from "./ui/button"
import { Card } from "./ui/card"
import type { FeedbackType } from "../App"

interface LandingPageProps {
  onFeedbackSelect: (type: FeedbackType) => void
}

export function LandingPage({ onFeedbackSelect }: LandingPageProps) {
  const feedbackOptions = [
    {
      type: "loved" as FeedbackType,
      label: "I Loved It",
      color: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white",
      icon: "😍",
    },
    {
      type: "liked" as FeedbackType,
      label: "I Liked It",
      color: "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white",
      icon: "😊",
    },
    {
      type: "better" as FeedbackType,
      label: "Can Be Better",
      color: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white",
      icon: "🤔",
    },
    {
      type: "poor" as FeedbackType,
      label: "Far From Good",
      color: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white",
      icon: "😞",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-md space-y-8 animate-bounce-in">
        {/* Logo/Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl font-bold text-white">
              BIP
            </span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">BIP AI</h1>
        </div>

        {/* Question */}
        <Card className="p-6 shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-3xl">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
            How was our Service?
          </h2>

          {/* Feedback Buttons */}
          <div className="grid grid-cols-1 gap-4">
            {feedbackOptions.map((option) => (
              <Button
                key={option.type}
                onClick={() => onFeedbackSelect(option.type)}
                className={`${option.color} h-14 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0`}
              >
                <span className="mr-3 text-xl">{option.icon}</span>
                {option.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">Your feedback helps us improve our service ✨</p>
      </div>
    </div>
  )
}