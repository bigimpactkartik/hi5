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
  const [showCharacterWarning, setShowCharacterWarning] = useState(false)

  const minCharacters = 30
  const isTextTooShort = editableText.trim().length < minCharacters

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
    if (isTextTooShort) {
      setShowCharacterWarning(true)
      return
    }

    onUpdate({
      finalText: editableText,
      ...(feedbackData.useAI ? { aiRefinedText: editableText } : { originalText: editableText }),
    })
    onSubmit()
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableText(e.target.value)
    if (showCharacterWarning && e.target.value.trim().length >= minCharacters) {
      setShowCharacterWarning(false)
    }
  }

  const isPositive = feedbackData.type === "loved" || feedbackData.type === "liked"

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-3xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Confirm Review...</CardTitle>
          <p className="text-gray-600 text-sm mt-2 font-medium">
            {feedbackData.useAI ? "Enhanced version ready for editing" : "Your original text"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-gray-600 font-medium">
                {isPositive ? "Enhancing your text..." : "Making feedback constructive..."}
              </span>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {isPositive ? "Your Review:" : "Your Feedback:"}
                </label>
                <Textarea
                  value={editableText}
                  onChange={handleTextChange}
                  placeholder={`Enter your ${isPositive ? "review" : "feedback"}...`}
                  className="min-h-[120px] resize-none border-gray-200 rounded-2xl bg-gray-50/50 transition-all duration-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs ${editableText.trim().length < minCharacters ? 'text-red-500' : 'text-gray-500'}`}>
                    {editableText.trim().length}/{minCharacters} characters minimum
                  </span>
                  {showCharacterWarning && (
                    <span className="text-xs text-red-500 font-medium">
                      Please enter at least {minCharacters} characters
                    </span>
                  )}
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!editableText.trim() || isTextTooShort}
                className="w-full text-white font-semibold py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
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