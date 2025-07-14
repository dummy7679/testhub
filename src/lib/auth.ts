import { supabase } from './supabase';
import type { Teacher } from './supabase';

export const teacherAuth = {
  async signIn(email: string, password: string) {
    // For demo purposes, we'll use a simple check
    // In production, teachers would be pre-registered in Supabase by admin
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

    throw new Error('Failed to sign in');
  },

  async signOut() {
    localStorage.removeItem('teacherAuth');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    // Check localStorage first for demo
    const storedAuth = localStorage.getItem('teacherAuth');
    if (storedAuth) {
      const teacher = JSON.parse(storedAuth);
      return { user: { id: teacher.id }, teacher };
    }
    
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

    return null;
  }
};