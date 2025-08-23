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
          shop_id: string | null
          customer_id: string | null
          rating: number
          comment: string | null
          prize_given: boolean
          submitted_at: string
        }
        Insert: {
          id?: string
          shop_id?: string | null
          customer_id?: string | null
          rating: number
          comment: string | null
          prize_given?: boolean
          submitted_at?: string
        }
        Update: {
          id?: string
          shop_id?: string | null
          customer_id?: string | null
          rating?: number
          comment?: string | null
          prize_given?: boolean
          submitted_at?: string
        }
      }
    }
    Views: {
      [key: string]: {
        Row: {
          [key: string]: Json | undefined
        }
        Insert: {
          [key: string]: Json | undefined
        }
        Update: {
          [key: string]: Json | undefined
        }
      }
    }
    Functions: {
      [key: string]: {
        Args: {
          [key: string]: Json | undefined
        }
        Returns: Json
      }
    }
    Enums: {
      feedback_type: 'loved' | 'liked' | 'better' | 'poor'
    }
  }
}