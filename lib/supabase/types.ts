export type FeedbackType = 'loved' | 'liked' | 'better' | 'poor'

export interface FeedbackSubmission {
  id: string
  user_id: string
  feedback_type: FeedbackType
  original_text: string
  ai_refined_text?: string
  final_text: string
  use_ai: boolean
  is_accurate?: boolean
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      feedback_submissions: {
        Row: FeedbackSubmission
        Insert: Omit<FeedbackSubmission, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FeedbackSubmission, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}