/*
  # Create feedback system tables

  1. New Tables
    - `feedback_submissions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `feedback_type` (text, enum: loved, liked, better, poor)
      - `original_text` (text)
      - `ai_refined_text` (text, nullable)
      - `final_text` (text)
      - `use_ai` (boolean)
      - `is_accurate` (boolean, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `feedback_submissions` table
    - Add policies for authenticated users to manage their own feedback
    - Add policy for service role to read all feedback (for analytics)
*/

-- Create feedback submissions table
CREATE TABLE IF NOT EXISTS feedback_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('loved', 'liked', 'better', 'poor')),
  original_text text NOT NULL,
  ai_refined_text text,
  final_text text NOT NULL,
  use_ai boolean DEFAULT true,
  is_accurate boolean,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for feedback_submissions
CREATE POLICY "Users can insert their own feedback"
  ON feedback_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own feedback"
  ON feedback_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON feedback_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for service role to read all feedback (for analytics)
CREATE POLICY "Service role can read all feedback"
  ON feedback_submissions
  FOR SELECT
  TO service_role
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feedback_submissions_updated_at
  BEFORE UPDATE ON feedback_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();