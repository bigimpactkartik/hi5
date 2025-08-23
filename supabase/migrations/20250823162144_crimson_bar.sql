/*
  # Fix RLS policy for feedbacks table

  1. Security Changes
    - Add policy to allow anonymous users to insert feedback
    - Ensure authenticated users can also insert feedback
    - Maintain existing read permissions

  This resolves the "new row violates row-level security policy" error
  by allowing both anonymous and authenticated users to submit feedback.
*/

-- Drop existing restrictive insert policy if it exists
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON feedbacks;

-- Create new policy that allows both anonymous and authenticated users to insert
CREATE POLICY "Allow feedback submission for all users"
  ON feedbacks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the existing policies remain intact
-- The table already has these policies based on your schema:
-- - "Enable read access for all users" (SELECT for public)
-- - "UpdateUserPolicy" (UPDATE for public)