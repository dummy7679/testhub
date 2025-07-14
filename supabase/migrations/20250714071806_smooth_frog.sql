/*
  # Initial Schema Setup for SOSE TestHub

  1. New Tables
    - `teachers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `subject` (text)
      - `school` (text)
      - `created_at` (timestamp)
    
    - `tests`
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, foreign key)
      - `title` (text)
      - `subject` (text)
      - `class` (text)
      - `chapter` (text)
      - `test_code` (text, unique)
      - `time_limit` (integer)
      - `questions` (jsonb)
      - `settings` (jsonb)
      - `created_at` (timestamp)
      - `is_active` (boolean)
    
    - `submissions`
      - `id` (uuid, primary key)
      - `test_id` (uuid, foreign key)
      - `student_name` (text)
      - `answers` (jsonb)
      - `auto_score` (integer)
      - `manual_score` (integer)
      - `total_marks` (integer)
      - `time_spent` (integer)
      - `tab_switch_count` (integer)
      - `ip_address` (text)
      - `submitted_at` (timestamp)
      - `graded_at` (timestamp)
      - `status` (text)
    
    - `questions`
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, foreign key)
      - `question` (text)
      - `type` (text)
      - `subject` (text)
      - `topic` (text)
      - `difficulty` (text)
      - `options` (jsonb)
      - `correct_answer` (text)
      - `marks` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for teachers to manage their own data
    - Add policies for students to submit tests
*/

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  subject text,
  school text DEFAULT 'SOSE Lajpat Nagar',
  created_at timestamptz DEFAULT now()
);

-- Create tests table
CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject text NOT NULL,
  class text NOT NULL,
  chapter text,
  test_code text UNIQUE NOT NULL,
  time_limit integer DEFAULT 60,
  questions jsonb NOT NULL DEFAULT '[]',
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES tests(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  answers jsonb DEFAULT '{}',
  auto_score integer DEFAULT 0,
  manual_score integer,
  total_marks integer NOT NULL,
  time_spent integer DEFAULT 0,
  tab_switch_count integer DEFAULT 0,
  ip_address text,
  submitted_at timestamptz DEFAULT now(),
  graded_at timestamptz,
  status text DEFAULT 'submitted'
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  question text NOT NULL,
  type text NOT NULL CHECK (type IN ('mcq', 'short', 'essay')),
  subject text NOT NULL,
  topic text,
  difficulty text DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  options jsonb,
  correct_answer text,
  marks integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Teachers policies
CREATE POLICY "Teachers can read own data"
  ON teachers
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Teachers can update own data"
  ON teachers
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Tests policies
CREATE POLICY "Teachers can manage own tests"
  ON tests
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Anyone can read active tests by code"
  ON tests
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Submissions policies
CREATE POLICY "Teachers can view submissions for their tests"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (
    test_id IN (
      SELECT id FROM tests WHERE teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update submissions for their tests"
  ON submissions
  FOR UPDATE
  TO authenticated
  USING (
    test_id IN (
      SELECT id FROM tests WHERE teacher_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can submit to active tests"
  ON submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    test_id IN (
      SELECT id FROM tests WHERE is_active = true
    )
  );

-- Questions policies
CREATE POLICY "Teachers can manage own questions"
  ON questions
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tests_code ON tests(test_code);
CREATE INDEX IF NOT EXISTS idx_tests_teacher ON tests(teacher_id);
CREATE INDEX IF NOT EXISTS idx_submissions_test ON submissions(test_id);
CREATE INDEX IF NOT EXISTS idx_questions_teacher ON questions(teacher_id);