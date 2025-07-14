import { supabase } from './supabase';
import type { Test, Submission, QuestionBank } from './supabase';

// Mock data for demo when Supabase is not configured
let mockTests: any[] = [];
let mockSubmissions: any[] = [];
let mockQuestions: any[] = [];
let mockTeachers: any[] = [
  {
    id: 'teacher-1',
    email: 'teacher@sose.edu',
    name: 'Ms. Priya Sharma',
    subject: 'Mathematics',
    school: 'SOSE Lajpat Nagar',
    created_at: new Date().toISOString()
  }
];

export const database = {
  // Test operations
  async createTest(testData: Omit<Test, 'id' | 'created_at'>) {
    if (!supabase) {
      // Mock implementation
      const newTest = {
        ...testData,
        id: `test-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      mockTests.push(newTest);
      return newTest;
    }

    try {
      const { data, error } = await supabase
        .from('tests')
        .insert([testData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to mock
      const newTest = {
        ...testData,
        id: `test-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      mockTests.push(newTest);
      return newTest;
    }
  },

  async getTestByCode(testCode: string) {
    if (!supabase) {
      // Mock implementation
      const test = mockTests.find(t => t.test_code === testCode.toUpperCase() && t.is_active !== false);
      if (!test) throw new Error('Test not found');
      return test;
    }

    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('test_code', testCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to mock
      const test = mockTests.find(t => t.test_code === testCode.toUpperCase() && t.is_active !== false);
      if (!test) throw new Error('Test not found');
      return test;
    }
  },

  async getTeacherTests(teacherId: string) {
    if (!supabase) {
      // Mock implementation
      return mockTests.filter(t => t.teacher_id === teacherId);
    }

    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to mock
      return mockTests.filter(t => t.teacher_id === teacherId);
    }
  },

  async updateTest(testId: string, updates: Partial<Test>) {
    if (!supabase) {
      // Mock implementation
      const testIndex = mockTests.findIndex(t => t.id === testId);
      if (testIndex === -1) throw new Error('Test not found');
      mockTests[testIndex] = { ...mockTests[testIndex], ...updates };
      return mockTests[testIndex];
    }

    try {
      const { data, error } = await supabase
        .from('tests')
        .update(updates)
        .eq('id', testId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to mock
      const testIndex = mockTests.findIndex(t => t.id === testId);
      if (testIndex === -1) throw new Error('Test not found');
      mockTests[testIndex] = { ...mockTests[testIndex], ...updates };
      return mockTests[testIndex];
    }
  },

  async deleteTest(testId: string) {
    if (!supabase) {
      // Mock implementation
      mockTests = mockTests.filter(t => t.id !== testId);
      return;
    }

    try {
      const { error } = await supabase
        .from('tests')
        .delete()
        .eq('id', testId);

      if (error) throw error;
    } catch (error) {
      // Fallback to mock
      mockTests = mockTests.filter(t => t.id !== testId);
    }
  },

  // Submission operations
  async submitTest(submissionData: Omit<Submission, 'id' | 'submitted_at'>) {
    if (!supabase) {
      // Mock implementation
      const newSubmission = {
        ...submissionData,
        id: `submission-${Date.now()}`,
        submitted_at: new Date().toISOString()
      };
      mockSubmissions.push(newSubmission);
      return newSubmission;
    }

    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to mock
      const newSubmission = {
        ...submissionData,
        id: `submission-${Date.now()}`,
        submitted_at: new Date().toISOString()
      };
      mockSubmissions.push(newSubmission);
      return newSubmission;
    }
  },

  async getTestSubmissions(testId: string) {
    if (!supabase) {
      // Mock implementation
      return mockSubmissions.filter(s => s.test_id === testId);
    }

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('test_id', testId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to mock
      return mockSubmissions.filter(s => s.test_id === testId);
    }
  },

  async updateSubmissionGrade(submissionId: string, manualScore: number) {
    if (!supabase) {
      // Mock implementation
      const submissionIndex = mockSubmissions.findIndex(s => s.id === submissionId);
      if (submissionIndex === -1) throw new Error('Submission not found');
      mockSubmissions[submissionIndex] = {
        ...mockSubmissions[submissionIndex],
        manual_score: manualScore,
        graded_at: new Date().toISOString(),
        status: 'graded'
      };
      return mockSubmissions[submissionIndex];
    }

    try {
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
    } catch (error) {
      // Fallback to mock
      const submissionIndex = mockSubmissions.findIndex(s => s.id === submissionId);
      if (submissionIndex === -1) throw new Error('Submission not found');
      mockSubmissions[submissionIndex] = {
        ...mockSubmissions[submissionIndex],
        manual_score: manualScore,
        graded_at: new Date().toISOString(),
        status: 'graded'
      };
      return mockSubmissions[submissionIndex];
    }
  },

  // Question bank operations
  async addQuestion(questionData: Omit<QuestionBank, 'id' | 'created_at'>) {
    if (!supabase) {
      // Mock implementation
      const newQuestion = {
        ...questionData,
        id: `question-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      mockQuestions.push(newQuestion);
      return newQuestion;
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([questionData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to mock
      const newQuestion = {
        ...questionData,
        id: `question-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      mockQuestions.push(newQuestion);
      return newQuestion;
    }
  },

  async getTeacherQuestions(teacherId: string) {
    if (!supabase) {
      // Mock implementation
      return mockQuestions.filter(q => q.teacher_id === teacherId);
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to mock
      return mockQuestions.filter(q => q.teacher_id === teacherId);
    }
  },

  async updateQuestion(questionId: string, updates: Partial<QuestionBank>) {
    if (!supabase) {
      // Mock implementation
      const questionIndex = mockQuestions.findIndex(q => q.id === questionId);
      if (questionIndex === -1) throw new Error('Question not found');
      mockQuestions[questionIndex] = { ...mockQuestions[questionIndex], ...updates };
      return mockQuestions[questionIndex];
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', questionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to mock
      const questionIndex = mockQuestions.findIndex(q => q.id === questionId);
      if (questionIndex === -1) throw new Error('Question not found');
      mockQuestions[questionIndex] = { ...mockQuestions[questionIndex], ...updates };
      return mockQuestions[questionIndex];
    }
  },

  async deleteQuestion(questionId: string) {
    if (!supabase) {
      // Mock implementation
      mockQuestions = mockQuestions.filter(q => q.id !== questionId);
      return;
    }

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
    } catch (error) {
      // Fallback to mock
      mockQuestions = mockQuestions.filter(q => q.id !== questionId);
    }
  },

  // Analytics
  async getTestAnalytics(testId: string) {
    let submissions;
    
    if (!supabase) {
      // Mock implementation
      submissions = mockSubmissions.filter(s => s.test_id === testId);
    } else {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('test_id', testId);

        if (error) throw error;
        submissions = data;
      } catch (error) {
        // Fallback to mock
        submissions = mockSubmissions.filter(s => s.test_id === testId);
      }
    }

    // Calculate analytics
    const totalSubmissions = submissions.length;
    const averageScore = totalSubmissions > 0 ? submissions.reduce((sum, sub) => sum + (sub.manual_score || sub.auto_score), 0) / totalSubmissions : 0;
    const averageTime = totalSubmissions > 0 ? submissions.reduce((sum, sub) => sum + sub.time_spent, 0) / totalSubmissions : 0;
    
    return {
      totalSubmissions,
      averageScore: Math.round(averageScore * 100) / 100,
      averageTime: Math.round(averageTime),
      submissions
    };
  },

  // Teacher operations
  async getTeacherByEmail(email: string) {
    if (!supabase) {
      // Mock implementation
      const teacher = mockTeachers.find(t => t.email === email);
      if (!teacher) throw new Error('Teacher not found');
      return teacher;
    }

    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to mock
      const teacher = mockTeachers.find(t => t.email === email);
      if (!teacher) throw new Error('Teacher not found');
      return teacher;
    }
  }
};