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

-- Create signins table
CREATE TABLE IF NOT EXISTS signins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id text UNIQUE NOT NULL,
  email text NOT NULL,
  full_name text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE signins ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to read their own data
CREATE POLICY "Users can read own signin data"
  ON signins
  FOR SELECT
  TO authenticated
  USING (clerk_id = auth.jwt() ->> 'sub');

-- Create policies for authenticated users to insert/update their own data
CREATE POLICY "Users can insert own signin data"
  ON signins
  FOR INSERT
  TO authenticated
  WITH CHECK (clerk_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own signin data"
  ON signins
  FOR UPDATE
  TO authenticated
  USING (clerk_id = auth.jwt() ->> 'sub')
  WITH CHECK (clerk_id = auth.jwt() ->> 'sub');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_signins_updated_at
  BEFORE UPDATE ON signins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();