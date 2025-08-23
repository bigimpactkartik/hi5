import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || ''

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return url.includes('.supabase.co') || url.includes('localhost') || url.includes('127.0.0.1')
  } catch {
    return false
  }
}

// Test if Supabase URL is reachable
const testSupabaseConnection = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
      },
    })
    return response.ok || response.status === 401 // 401 is expected without proper auth
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
}

// Only create client if both URL and key are available and URL is valid
export const supabase = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : null

// Client-side auth client
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    console.warn('Supabase configuration issue:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlValid: isValidUrl(supabaseUrl),
      url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing'
    })
    return null
  }
  
  try {
    return createClientComponentClient<Database>()
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}
