import { useEffect } from 'react'

export default function ReviewRedirect() {
  useEffect(() => {
    // Check if this is from negative feedback flow
    const urlParams = new URLSearchParams(window.location.search)
    const feedbackType = urlParams.get('type')
    
    // Only redirect to Google Reviews for positive feedback
    if (feedbackType === 'loved' || feedbackType === 'liked') {
      window.location.href = 'https://g.page/r/CRrF1teEyCrUEAE/review'
    } else {
      // For negative feedback or no type specified, go back to main app
      window.location.href = '/'
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Processing...
        </h1>
        <p className="text-gray-600">
          Completing your feedback
        </p>
      </div>
    </div>
  )
}