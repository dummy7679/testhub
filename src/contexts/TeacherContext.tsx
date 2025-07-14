import React, { createContext, useContext, useState } from 'react';

interface TeacherContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  teacher: any;
  setTeacher: (teacher: any) => void;
  showDashboardButton: boolean;
  setShowDashboardButton: (show: boolean) => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const stored = localStorage.getItem('teacherAuth');
    return stored ? JSON.parse(stored).isAuthenticated : false;
  });
  const [teacher, setTeacher] = useState<any>(() => {
    const stored = localStorage.getItem('teacherAuth');
    return stored ? JSON.parse(stored).teacher : null;
  });
  const [showDashboardButton, setShowDashboardButton] = useState<boolean>(false);

  const setAuthenticatedWithPersistence = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
    if (!authenticated) {
      localStorage.removeItem('teacherAuth');
    }
  };

  const setTeacherWithPersistence = (teacherData: any) => {
    setTeacher(teacherData);
    if (teacherData) {
      localStorage.setItem('teacherAuth', JSON.stringify({
        isAuthenticated: true,
        teacher: teacherData
      }));
    }
  };

  return (
    <TeacherContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated: setAuthenticatedWithPersistence,
      teacher,
      setTeacher: setTeacherWithPersistence,
      showDashboardButton,
      setShowDashboardButton
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