import React, { createContext, useContext, useState, useEffect } from 'react';

interface TestContextType {
  currentTest: any;
  setCurrentTest: (test: any) => void;
  answers: Record<string, string>;
  setAnswers: (answers: Record<string, string>) => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  currentQuestion: number;
  setCurrentQuestion: (question: number) => void;
  tabSwitchCount: number;
  incrementTabSwitchCount: () => void;
  isTestActive: boolean;
  setIsTestActive: (active: boolean) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);

  const incrementTabSwitchCount = () => {
    setTabSwitchCount(prev => prev + 1);
  };

  // Tab switch detection
  useEffect(() => {
    if (!isTestActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        incrementTabSwitchCount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isTestActive]);

  return (
    <TestContext.Provider value={{
      currentTest,
      setCurrentTest,
      answers,
      setAnswers,
      timeRemaining,
      setTimeRemaining,
      currentQuestion,
      setCurrentQuestion,
      tabSwitchCount,
      incrementTabSwitchCount,
      isTestActive,
      setIsTestActive
    }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestContextProvider');
  }
  return context;
};