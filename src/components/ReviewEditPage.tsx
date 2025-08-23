import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { enhanceText } from "../lib/supabase"
import type { FeedbackData } from "../App"

interface ReviewEditPageProps {
  feedbackData: FeedbackData
  onUpdate: (data: Partial<FeedbackData>) => void
  onSubmit: () => void
}

export function ReviewEditPage({ feedbackData, onUpdate, onSubmit }: ReviewEditPageProps) {
  const [editableText, setEditableText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initializeText = async () => {
      if (feedbackData.useAI && feedbackData.originalText && !feedbackData.aiRefinedText) {
        // Generate AI-refined text if needed
        console.log('Starting AI enhancement for:', feedbackData.originalText)
        setIsLoading(true)
        try {
          const aiText = await enhanceText(feedbackData.originalText, feedbackData.type)
          console.log('AI enhanced text:', aiText)
          setEditableText(aiText)
          onUpdate({ aiRefinedText: aiText })
        } catch (error) {
          console.error("Enhancement error:", error)
          setEditableText(feedbackData.originalText || "")
        } finally {
          setIsLoading(false)
        }
      } else {
        // Use existing AI-refined text or original text
        const textToShow = feedbackData.useAI
          ? feedbackData.aiRefinedText || feedbackData.originalText
          : feedbackData.originalText
        console.log('Using existing text:', textToShow)
        setEditableText(textToShow || "")
      }
    }

    initializeText()
  }, [feedbackData, onUpdate])

  const handleSubmit = () => {
    onUpdate({
      finalText: editableText,
      ...(feedbackData.useAI ? { aiRefinedText: editableText } : { originalText: editableText }),
    })
    onSubmit()
  }

  const isPositive = feedbackData.type === "loved" || feedbackData.type === "liked"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">Confirm Review...</CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            {feedbackData.useAI ? "Enhanced version ready for editing" : "Your original text"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Enhancing your text...</span>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {isPositive ? "Your Review:" : "Your Feedback:"}
                </label>
                <Textarea
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  placeholder={`Enter your ${isPositive ? "review" : "feedback"}...`}
                  className="min-h-[120px] resize-none border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!editableText.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Submit {isPositive ? "Review" : "Feedback"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}