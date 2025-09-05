import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LandingPage } from "./components/LandingPage"
import { ImprovementEntry } from "./components/ImprovementEntry"
import { ThankYouScreen } from "./components/ThankYouScreen"
import { ReviewEditPage } from "./components/ReviewEditPage"
import { SyncSignin } from "./components/SyncSignin"
import ReviewRedirect from "./pages/redirect/review"

export type FeedbackType = "loved" | "liked" | "better" | "poor"

export interface FeedbackData {
  type: FeedbackType
  originalText?: string
  aiRefinedText?: string
  useAI: boolean
  isAccurate?: boolean
  finalText?: string
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/redirect/review" element={<ReviewRedirect />} />
        <Route path="/*" element={<FeedbackFlow />} />
      </Routes>
    </Router>
  )
}

function FeedbackFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    type: "loved",
    useAI: true,
  })

  const isPositiveFeedback = feedbackData.type === "loved" || feedbackData.type === "liked"

  const steps = [
    <LandingPage
      key="landing"
      onFeedbackSelect={(type) => {
        setFeedbackData((prev) => ({ ...prev, type }))
        setCurrentStep(1)
      }}
    />,
    <ImprovementEntry
      key="improvement"
      feedbackData={feedbackData}
      onUpdate={(data) => setFeedbackData((prev) => ({ ...prev, ...data }))}
      onNext={() => setCurrentStep(2)}
    />,
    <ReviewEditPage
      key="review-edit"
      feedbackData={feedbackData}
      onUpdate={(data) => setFeedbackData((prev) => ({ ...prev, ...data }))}
      onSubmit={() => setCurrentStep(3)}
    />,
    <ThankYouScreen key="thanks" feedbackData={feedbackData} />,
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="animate-slide-in-up">{steps[currentStep]}</div>
      <SyncSignin />
    </div>
  )
}