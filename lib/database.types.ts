export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      feedbacks: {
        Row: {
          id: string
          created_at: string
          type: 'loved' | 'liked' | 'better' | 'poor'
          original_text: string | null
          ai_refined_text: string | null
          final_text: string | null
          use_ai: boolean
          is_accurate: boolean | null
          user_email: string | null
          user_name: string | null
        }
        Insert: {
          id?: string
          created_at?: string
      comment: string | null
          is_accurate?: boolean | null
          user_email?: string | null
          user_name?: string | null
        }
        Update: {
          id?: string
          created_at?: string
      comment?: string | null
          is_accurate?: boolean | null
          user_email?: string | null
          user_name?: string | null
        }
      }
    }
    Views: {
      comment?: string | null
    Enums: {
      feedback_type: 'loved' | 'liked' | 'better' | 'poor'
    }
  }
}