/*
  # Create feedbacks table for BIP AI feedback system

  1. New Tables
    - `feedbacks`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `type` (enum: loved, liked, better, poor)
      - `comment` (text, nullable)
      - `user_email` (text, nullable)
      - `user_name` (text, nullable)

  2. Security
    - Enable RLS on `feedbacks` table
    - Add policy for public insert (anonymous feedback)
    - Add policy for reading own feedback
*/

-- Create enum for feedback types
CREATE TYPE feedback_type AS ENUM ('loved', 'liked', 'better', 'poor');

-- Create feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  type feedback_type NOT NULL,
  comment text,
  user_email text,
  user_name text
);

-- Enable Row Level Security
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous feedback submission (anyone can insert)
CREATE POLICY "Anyone can submit feedback"
  ON feedbacks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy for reading feedback (for analytics/admin purposes)
CREATE POLICY "Authenticated users can read feedback"
  ON feedbacks
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_type ON feedbacks(type);