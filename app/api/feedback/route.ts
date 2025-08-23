import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type FeedbackInsert = Database['public']['Tables']['feedback']['Insert']

export async function POST(request: NextRequest) {
  try {
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
      .from('feedback')
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
    const { data, error } = await supabase
      .from('feedback')
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