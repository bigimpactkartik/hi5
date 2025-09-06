import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'

export default function ReviewRedirect() {
  const { user, isLoaded } = useUser()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Wait for authentication state to load
    if (!isLoaded || hasRedirected) {
      return
    }

    const handleRedirection = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const feedbackType = urlParams.get('type')
      
      // Check if this is a positive feedback flow
      const isPositiveFeedback = feedbackType === 'loved' || feedbackType === 'liked'
      
      if (isPositiveFeedback && user) {
        // For positive feedback with authenticated user, redirect to Google Reviews
        setHasRedirected(true)
        window.location.href = 'https://g.page/r/CRrF1teEyCrUEAE/review'
      } else if (feedbackType && !isPositiveFeedback) {
        // For negative feedback, redirect back to main app
        setHasRedirected(true)
        window.location.href = '/'
      } else if (!feedbackType) {
        // No feedback type specified, go back to main app
        setHasRedirected(true)
        window.location.href = '/'
      } else if (!user) {
        // User not authenticated yet, redirect back to main app
        setHasRedirected(true)
        window.location.href = '/'
      }
    }

    // Small delay to ensure authentication state is fully resolved
    const timeoutId = setTimeout(handleRedirection, 100)
    
    return () => clearTimeout(timeoutId)
  }, [user, isLoaded, hasRedirected])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {!isLoaded ? 'Loading...' : 'Processing...'}
        </h1>
        <p className="text-gray-600">
          {!isLoaded ? 'Checking authentication status' : 'Completing your feedback'}
        </p>
      </div>
    </div>
  )
}