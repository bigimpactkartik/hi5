@@ .. @@
 /*
   # Create feedback table with AI enhancement support

   1. New Tables
     - `feedback`
       - `id` (uuid, primary key)
       - `created_at` (timestamp)
       - `type` (feedback_type enum)
       - `original_text` (text)
       - `ai_refined_text` (text)
       - `final_text` (text)
       - `use_ai` (boolean)
       - `is_accurate` (boolean)
       - `user_email` (text)
       - `user_name` (text)
   2. Security
     - Enable RLS on `feedback` table
     - Add policies for anonymous and authenticated users
 */

-CREATE TYPE feedback_type AS ENUM ('loved', 'liked', 'better', 'poor');
+DO $$ 
+BEGIN
+  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feedback_type') THEN
+    CREATE TYPE feedback_type AS ENUM ('loved', 'liked', 'better', 'poor');
+  END IF;
+END $$;