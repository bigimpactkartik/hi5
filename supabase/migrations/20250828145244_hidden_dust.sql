/*
  # Create signins table for user authentication sync

  1. New Tables
    - `signins`
      - `id` (uuid, primary key)
      - `clerk_id` (text, unique, not null)
      - `email` (text, not null)
      - `full_name` (text, nullable)
      - `image_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `signins` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert/update their own data
*/

CREATE TABLE IF NOT EXISTS signins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id text UNIQUE NOT NULL,
  email text NOT NULL,
  full_name text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE signins ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own data
CREATE POLICY "Users can read own signin data"
  ON signins
  FOR SELECT
  TO authenticated
  USING (clerk_id = auth.jwt() ->> 'sub');

-- Policy for users to insert/update their own data
CREATE POLICY "Users can upsert own signin data"
  ON signins
  FOR ALL
  TO authenticated
  USING (clerk_id = auth.jwt() ->> 'sub')
  WITH CHECK (clerk_id = auth.jwt() ->> 'sub');

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_signins_clerk_id ON signins(clerk_id);
CREATE INDEX IF NOT EXISTS idx_signins_email ON signins(email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_signins_updated_at
  BEFORE UPDATE ON signins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();