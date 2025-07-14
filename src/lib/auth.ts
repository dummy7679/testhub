import { supabase } from './supabase';
import { database } from './database';
import type { Teacher } from './supabase';

export const teacherAuth = {
  async signIn(email: string, password: string) {
    // For demo purposes, we'll use a simple check
    // Teachers are pre-registered by administration
    if (email === 'teacher@sose.edu' && password === 'password123') {
      const mockTeacher = {
        id: 'teacher-1',
        email: 'teacher@sose.edu',
        name: 'Ms. Priya Sharma',
        subject: 'Mathematics',
        school: 'SOSE Lajpat Nagar',
        created_at: new Date().toISOString()
      };
      
      // Store in localStorage for demo
      localStorage.setItem('teacherAuth', JSON.stringify(mockTeacher));
      return { user: { id: mockTeacher.id }, teacher: mockTeacher };
    }
    
    if (!supabase) {
      // Try to find teacher in mock data
      try {
        const teacher = await database.getTeacherByEmail(email);
        if (password === 'password123') { // Demo password
          localStorage.setItem('teacherAuth', JSON.stringify(teacher));
          return { user: { id: teacher.id }, teacher };
        }
      } catch (error) {
        // Teacher not found
      }
      throw new Error('Invalid email or password');
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { data: teacher, error: teacherError } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (teacherError) throw teacherError;
        return { user: authData.user, teacher };
      }
    } catch (error) {
      // Fallback to demo login
      if (email === 'teacher@sose.edu' && password === 'password123') {
        const mockTeacher = {
          id: 'teacher-1',
          email: 'teacher@sose.edu',
          name: 'Ms. Priya Sharma',
          subject: 'Mathematics',
          school: 'SOSE Lajpat Nagar',
          created_at: new Date().toISOString()
        };
        
        localStorage.setItem('teacherAuth', JSON.stringify(mockTeacher));
        return { user: { id: mockTeacher.id }, teacher: mockTeacher };
      }
      throw new Error('Invalid email or password');
    }

    throw new Error('Failed to sign in');
  },

  async signOut() {
    localStorage.removeItem('teacherAuth');
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  },

  async getCurrentUser() {
    // Check localStorage first for demo
    const storedAuth = localStorage.getItem('teacherAuth');
    if (storedAuth) {
      const teacher = JSON.parse(storedAuth);
      return { user: { id: teacher.id }, teacher };
    }
    
    if (!supabase) {
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: teacher, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        return { user, teacher };
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }

    return null;
  }
};