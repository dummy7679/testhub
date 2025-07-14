import { supabase } from './supabase';
import type { Test, Submission, QuestionBank } from './supabase';

export const database = {
  // Test operations
  async createTest(testData: Omit<Test, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('tests')
      .insert([testData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTestByCode(testCode: string) {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('test_code', testCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  },

  async getTeacherTests(teacherId: string) {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateTest(testId: string, updates: Partial<Test>) {
    const { data, error } = await supabase
      .from('tests')
      .update(updates)
      .eq('id', testId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTest(testId: string) {
    const { error } = await supabase
      .from('tests')
      .delete()
      .eq('id', testId);

    if (error) throw error;
  },

  // Submission operations
  async submitTest(submissionData: Omit<Submission, 'id' | 'submitted_at'>) {
    const { data, error } = await supabase
      .from('submissions')
      .insert([submissionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTestSubmissions(testId: string) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('test_id', testId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateSubmissionGrade(submissionId: string, manualScore: number) {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        manual_score: manualScore,
        graded_at: new Date().toISOString(),
        status: 'graded'
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Question bank operations
  async addQuestion(questionData: Omit<QuestionBank, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('questions')
      .insert([questionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTeacherQuestions(teacherId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateQuestion(questionId: string, updates: Partial<QuestionBank>) {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', questionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteQuestion(questionId: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId);

    if (error) throw error;
  },

  // Analytics
  async getTestAnalytics(testId: string) {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('test_id', testId);

    if (error) throw error;

    // Calculate analytics
    const totalSubmissions = submissions.length;
    const averageScore = submissions.reduce((sum, sub) => sum + (sub.manual_score || sub.auto_score), 0) / totalSubmissions;
    const averageTime = submissions.reduce((sum, sub) => sum + sub.time_spent, 0) / totalSubmissions;
    
    return {
      totalSubmissions,
      averageScore: Math.round(averageScore * 100) / 100,
      averageTime: Math.round(averageTime),
      submissions
    };
  }
};