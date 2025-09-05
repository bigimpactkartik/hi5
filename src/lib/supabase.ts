import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''

console.log('Supabase Config Check:')
console.log('- URL:', supabaseUrl)
console.log('- Key exists:', !!supabaseAnonKey)
console.log('- Key length:', supabaseAnonKey.length)

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return url.includes('.supabase.co') || url.includes('localhost') || url.includes('127.0.0.1')
  } catch {
    return false
  }
}

console.log('- URL is valid:', isValidUrl(supabaseUrl))
// Only create client if both URL and key are available and URL is valid
export const supabase = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey
        }
      }
    })
  : null

if (!supabase) {
  console.error('❌ Supabase client not initialized. Check your environment variables.')
} else {
  console.log('✅ Supabase client initialized successfully')
}
export const saveFeedback = async (feedbackData: any) => {
  if (!supabase) {
    console.error('Supabase not configured')
    return { error: 'Database not configured' }
  }

  try {
    // Map feedback type to rating (1-5 scale)
    const ratingMap = {
      'poor': 1,
      'better': 2,
      'liked': 4,
      'loved': 5
    }
    
    const data = {
      shop_id: null,
      customer_id: null,
      rating: ratingMap[feedbackData.type as keyof typeof ratingMap] || 3,
      comment: feedbackData.finalText || feedbackData.aiRefinedText || feedbackData.originalText,
      prize_given: false,
      submitted_at: new Date().toISOString()
    }

    const { data: result, error } = await supabase
      .from('feedbacks')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return { error: 'Failed to save feedback' }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error('Save feedback error:', error)
    return { error: 'Internal error' }
  }
}

export const enhanceText = async (text: string, type: string) => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not configured - using original text')
    return text
  }

  try {
    const isPositive = type === "loved" || type === "liked"
    const prompt = isPositive
      ? `Enhance this positive review to make it more articulate, professional, and polished, while keeping the original sentiment intact. Return only one improved version, not multiple options:\n\n"${text}"`
      : `"Take the following negative feedback and rewrite it as constructive criticism for stakeholders. Keep it concise, professional, and solution-oriented. Highlight the core issues clearly, and frame them as actionable improvements so stakeholders understand what can be done better and why.\n\n"${text}"`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      return text
    }

    const data = await response.json()
    console.log('Gemini API response:', data)
    const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text || text

    return enhancedText
  } catch (error) {
    console.error('Enhancement error:', error)
    return text
  }
}