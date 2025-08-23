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
        // Test connection without querying specific tables
        const { error } = await supabase.auth.getSession()
        if (error) {
          console.error('Supabase auth connection failed:', error)
        } else {
          console.info('Supabase connection successful')
          
          // Test if feedback table exists
          const { error: tableError } = await supabase.from('feedbacks').select('count').limit(1).maybeSingle()
          if (tableError) {
            if (tableError.code === '42P01') {
              console.warn('⚠️  Database table "feedbacks" does not exist.')
              console.info('📋 To fix this, you need to run the database migration:')
              console.info('   1. Go to your Supabase dashboard')
              console.info('   2. Navigate to the SQL Editor')
              console.info('   3. Run the migration from: supabase/migrations/20250823124906_steep_disk.sql')
              console.info('   4. Or use Supabase CLI: supabase db push')
            } else {
              console.error('Database table access error:', tableError)
            }
          } else {
            console.info('✅ Database table "feedbacks" is accessible')
          }
        }
      } catch (error) {
        console.error('Supabase connection error:', error)
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