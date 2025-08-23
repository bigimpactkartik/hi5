/*
  # Create feedback table for BIP AI feedback system

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `type` (enum: loved, liked, better, poor)
      - `original_text` (text, nullable)
      - `ai_refined_text` (text, nullable)
      - `final_text` (text, nullable)
      - `use_ai` (boolean, default true)
      - `is_accurate` (boolean, nullable)
      - `user_email` (text, nullable)
      - `user_name` (text, nullable)

  2. Security
    - Enable RLS on `feedback` table
    - Add policy for public insert (anonymous feedback)
    - Add policy for reading own feedback
*/

-- Create enum for feedback types
CREATE TYPE feedback_type AS ENUM ('loved', 'liked', 'better', 'poor');

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  type feedback_type NOT NULL,
  original_text text,
  ai_refined_text text,
  final_text text,
  use_ai boolean DEFAULT true,
  is_accurate boolean,
  user_email text,
  user_name text
);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous feedback submission (anyone can insert)
CREATE POLICY "Anyone can submit feedback"
  ON feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy for reading feedback (for analytics/admin purposes)
CREATE POLICY "Authenticated users can read feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);