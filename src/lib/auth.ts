import { supabase } from './supabase';
import type { Teacher } from './supabase';

export const teacherAuth = {
  async signIn(email: string, password: string) {
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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
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