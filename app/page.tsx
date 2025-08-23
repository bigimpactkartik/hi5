"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { ImprovementEntry } from "@/components/improvement-entry"
import { ThankYouScreen } from "@/components/thank-you-screen"
import { ReviewEditPage } from "@/components/review-edit-page"

export type FeedbackType = "loved" | "liked" | "better" | "poor"

export interface FeedbackData {
  type: FeedbackType
  originalText?: string
  aiRefinedText?: string
  useAI: boolean
  isAccurate?: boolean
  finalText?: string
}

export default function FeedbackFlow() {
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
      onNext={() => {
        if (isPositiveFeedback) {
          setCurrentStep(2)
        } else {
          setCurrentStep(3)
        }
      }}
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
    </div>
  )
}
