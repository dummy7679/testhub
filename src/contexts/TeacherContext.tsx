import React, { createContext, useContext, useState } from 'react';
import { teacherAuth } from '../lib/auth';
import type { Teacher } from '../lib/supabase';

interface TeacherContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  teacher: Teacher | null;
  setTeacher: (teacher: Teacher | null) => void;
  showDashboardButton: boolean;
  setShowDashboardButton: (show: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return false; // Will be set by auth state listener
  });
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [showDashboardButton, setShowDashboardButton] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check auth state on mount
  React.useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const authData = await teacherAuth.getCurrentUser();
      if (authData) {
        setIsAuthenticated(true);
        setTeacher(authData.teacher);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { teacher: teacherData } = await teacherAuth.signIn(email, password);
      setIsAuthenticated(true);
      setTeacher(teacherData);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await teacherAuth.signOut();
      setIsAuthenticated(false);
      setTeacher(null);
    } finally {
      setLoading(false);
    }
  };

  const setAuthenticatedWithPersistence = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  const setTeacherWithPersistence = (teacherData: Teacher | null) => {
    setTeacher(teacherData);
  };

  return (
    <TeacherContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated: setAuthenticatedWithPersistence,
      teacher,
      setTeacher: setTeacherWithPersistence,
      showDashboardButton,
      setShowDashboardButton,
      signIn,
      signOut,
      loading
    }}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacher must be used within a TeacherContextProvider');
  }
  return context;
};