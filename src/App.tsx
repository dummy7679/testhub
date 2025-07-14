import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TestContextProvider } from './contexts/TestContext';
import { TeacherContextProvider } from './contexts/TeacherContext';
import HomePage from './pages/HomePage';
import JoinTest from './pages/JoinTest';
import StartTest from './pages/StartTest';
import SubmitTest from './pages/SubmitTest';
import TeacherLogin from './pages/teacher/TeacherLogin';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateTest from './pages/teacher/CreateTest';
import AllTests from './pages/teacher/AllTests';
import Submissions from './pages/teacher/Submissions';
import Analytics from './pages/teacher/Analytics';
import Rankings from './pages/teacher/Rankings';
import ExportCenter from './pages/teacher/ExportCenter';
import QuestionBank from './pages/teacher/QuestionBank';
import ReportHub from './pages/teacher/ReportHub';
import Settings from './pages/teacher/Settings';

function App() {
  return (
    <TestContextProvider>
      <TeacherContextProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Student Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/test" element={<JoinTest />} />
              <Route path="/test/start/:testCode" element={<StartTest />} />
              <Route path="/test/submit/:testCode" element={<SubmitTest />} />
              
              {/* Teacher Routes */}
              <Route path="/teacher/login" element={<TeacherLogin />} />
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/create" element={<CreateTest />} />
              <Route path="/teacher/tests" element={<AllTests />} />
              <Route path="/teacher/submissions" element={<Submissions />} />
              <Route path="/teacher/analytics/:testCode" element={<Analytics />} />
              <Route path="/teacher/rankings/:testCode" element={<Rankings />} />
              <Route path="/teacher/exports" element={<ExportCenter />} />
              <Route path="/teacher/bank" element={<QuestionBank />} />
              <Route path="/teacher/reporthub" element={<ReportHub />} />
              <Route path="/teacher/settings" element={<Settings />} />
            </Routes>
          </div>
        </Router>
      </TeacherContextProvider>
    </TestContextProvider>
  );
}

export default App;