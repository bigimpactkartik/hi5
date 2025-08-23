'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  // If Supabase is not configured, set loading to false and return
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      console.warn('Supabase not configured - authentication disabled. Please check your environment variables.')
      return
    }

    // Test connection and provide helpful error messages
    const testConnection = async () => {
      try {
        // Simple connection test
        const { error } = await supabase.from('feedback').select('count').limit(1).maybeSingle()
        if (error) {
          if (error.code === 'PGRST116') {
            console.info('Supabase connected but feedback table not found - this is normal if migrations haven\'t been run')
          } else if (error.message?.includes('refused') || error.message?.includes('network')) {
            console.error('Supabase connection refused. Please check:', {
              url: process.env.NEXT_PUBLIC_SUPABASE_URL,
              suggestion: 'Verify your Supabase project URL and ensure the project is active'
            })
          } else {
            console.error('Supabase connection test failed:', error)
          }
        }
      } catch (error) {
        console.error('Supabase connection error - the project may be paused or the URL may be incorrect:', error)
      }
    }

    testConnection()
  }, [supabase])

  useEffect(() => {
    if (!supabase) return

    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signInWithGoogle = async () => {
    if (!supabase) {
      console.error('Supabase not configured')
      return
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const signOut = async () => {
    if (!supabase) {
      console.error('Supabase not configured')
      return
    }
    
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}