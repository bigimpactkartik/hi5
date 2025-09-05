import { useEffect } from 'react'

export default function ReviewRedirect() {
  useEffect(() => {
    // Redirect to Google Reviews immediately
    window.location.href = 'https://g.page/r/CRrF1teEyCrUEAE/review'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Redirecting...
        </h1>
        <p className="text-gray-600">
          Taking you to Google Reviews
        </p>
      </div>
    </div>
  )
}