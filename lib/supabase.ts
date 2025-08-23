import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || ''

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return url.includes('.supabase.co') || url.includes('localhost')
  } catch {
    return false
  }
}

// Only create client if both URL and key are available and URL is valid
export const supabase = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

// Client-side auth client
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    console.warn('Supabase environment variables not configured or invalid URL format')
    return null
  }
  
  try {
    return createClientComponentClient<Database>()
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}

// For server-side operations