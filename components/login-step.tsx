"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface LoginStepProps {
  onNext: () => void
}

export function LoginStep({ onNext }: LoginStepProps) {
  const socialLogins = [
    {
      name: "Google",
      icon: "🔍",
      color: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300",
    },
    {
      name: "Meta",
      icon: "📘",
      color: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      name: "LinkedIn",
      icon: "💼",
      color: "bg-blue-700 hover:bg-blue-800 text-white",
    },
  ]

  const handleSocialLogin = (provider: string) => {
    // Simulate login process
    console.log(`Logging in with ${provider}`)
    // In real implementation, this would integrate with Supabase auth
    setTimeout(() => {
      onNext()
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md space-y-6 animate-slide-in-up">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-heading)]">The Last Step!</h1>
          <p className="text-muted-foreground mt-2">Sign in to complete your feedback submission</p>
        </div>

        {/* Login Card */}
        <Card className="p-6 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <div className="space-y-4">
            {socialLogins.map((login) => (
              <Button
                key={login.name}
                onClick={() => handleSocialLogin(login.name)}
                className={`w-full h-12 ${login.color} rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
              >
                <span className="mr-3 text-lg">{login.icon}</span>
                Continue with {login.name}
              </Button>
            ))}
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          We use this information to improve our service and send you updates
        </p>
      </div>
    </div>
  )
}
