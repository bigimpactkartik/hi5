import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

type FeedbackInsert = Database['public']['Tables']['feedback']['Insert']

export async function POST(request: NextRequest) {
  try {
    // Create server-side Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase environment variables not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }
    
    // Validate URL format
    if (!supabaseUrl.includes('.supabase.co') && !supabaseUrl.includes('localhost')) {
      console.error('Invalid Supabase URL format:', supabaseUrl)
      return NextResponse.json(
        { error: 'Invalid database configuration' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    const body = await request.json()
    
    const feedbackData: FeedbackInsert = {
      type: body.type,
      original_text: body.originalText,
      ai_refined_text: body.aiRefinedText,
      final_text: body.finalText,
      use_ai: body.useAI,
      is_accurate: body.isAccurate,
      user_email: body.userEmail,
      user_name: body.userName,
    }

    const { data, error } = await supabase
      .from('feedbacks')
      .insert(feedbackData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Create server-side Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase environment variables not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }
    
    // Validate URL format
    if (!supabaseUrl.includes('.supabase.co') && !supabaseUrl.includes('localhost')) {
      console.error('Invalid Supabase URL format:', supabaseUrl)
      return NextResponse.json(
        { error: 'Invalid database configuration' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}