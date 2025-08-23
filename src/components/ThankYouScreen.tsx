import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { saveFeedback, supabase } from "../lib/supabase"
import type { FeedbackData } from "../App"
import type { User } from "@supabase/supabase-js"

interface ThankYouScreenProps {
  feedbackData: FeedbackData
}

export function ThankYouScreen({ feedbackData }: ThankYouScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const isPositiveFeedback = feedbackData.type === "loved" || feedbackData.type === "liked"
  const displayText = feedbackData.finalText || feedbackData.originalText

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 4000)
    
    // Save feedback to Supabase
    saveFeedbackToDatabase()
    
    // Get current user and listen for auth changes
    getCurrentUser()
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    }) || { data: { subscription: null } }
    
    return () => {
      clearTimeout(timer)
      subscription?.unsubscribe()
    }
  }, [])

  const getCurrentUser = async () => {
    if (!supabase) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!supabase) return
    
    setIsSigningIn(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      
      if (error) {
        console.error('Sign in error:', error)
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    if (!supabase) return
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

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

  const copyToClipboard = async () => {
    if (!displayText) return

    try {
      await navigator.clipboard.writeText(displayText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Copy failed:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
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
                  "oklch(var(--feedback-loved))",
                  "oklch(var(--feedback-liked))",
                  "oklch(var(--feedback-better))",
                  "oklch(var(--feedback-poor))",
                ][Math.floor(Math.random() * 4)],
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-md space-y-6 animate-bounce-in">
        {/* Success Icon */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-4xl text-white">✓</span>
          </div>
        </div>

        {/* Thank You Card */}
        <Card className="p-8 shadow-lg border-0 bg-card/80 backdrop-blur-sm text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4 font-[family-name:var(--font-heading)]">Thank You!</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Thank you for sharing your feedback with BIP AI.
          </p>

          {isPositiveFeedback && displayText && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground mb-2">Your review:</p>
                <p className="text-sm text-foreground">{displayText}</p>
              </div>
              <Button
                onClick={copyToClipboard}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-3"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              <p className="text-xs text-muted-foreground">Paste this review on Google to support us.</p>
            </div>
          )}

          {!isPositiveFeedback && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">Collect your reward at the desk.</p>
            </div>
          )}

          {/* Authentication Section */}
          <div className="mt-6 pt-6 border-t border-border">
            {user ? (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-3">
                  {user.user_metadata?.avatar_url && (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Welcome, {user.user_metadata?.full_name || user.email}!
                    </p>
                    <p className="text-xs text-muted-foreground">Signed in with Google</p>
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sign in to save your feedback preferences
                </p>
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
                >
                  {isSigningIn ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {isSaving ? "Saving feedback..." : "Feedback submitted successfully"}
          </p>
          <p className="text-xs text-muted-foreground">Visit us at hi5.com/bipai</p>
        </div>
      </div>
    </div>
  )
}