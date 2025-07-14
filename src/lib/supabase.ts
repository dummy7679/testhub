import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Teacher {
  id: string;
  email: string;
  name: string;
  subject?: string;
  school?: string;
  created_at: string;
}

export interface Test {
  id: string;
  teacher_id: string;
  title: string;
  subject: string;
  class: string;
  chapter?: string;
  test_code: string;
  time_limit: number;
  questions: Question[];
  settings: any;
  created_at: string;
  is_active: boolean;
}

export interface Question {
  id: string;
  type: 'mcq' | 'short' | 'essay';
  question: string;
  options?: string[];
  correct_answer?: string;
  marks: number;
}

export interface Submission {
  id: string;
  test_id: string;
  student_name: string;
  answers: Record<string, string>;
  auto_score: number;
  manual_score?: number;
  total_marks: number;
  time_spent: number;
  tab_switch_count: number;
  ip_address?: string;
  submitted_at: string;
  graded_at?: string;
  status: string;
}

export interface QuestionBank {
  id: string;
  teacher_id: string;
  question: string;
  type: 'mcq' | 'short' | 'essay';
  subject: string;
  topic?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  options?: string[];
  correct_answer?: string;
  marks: number;
  created_at: string;
}