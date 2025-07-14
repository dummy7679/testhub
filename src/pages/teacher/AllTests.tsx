import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, BarChart3, FileDown, Trophy, BookOpen, Calendar, Users } from 'lucide-react';
import SOSELogo from '../../components/SOSELogo';

const AllTests: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<any[]>([]);

  useEffect(() => {
    // Load tests from localStorage
    const storedTests = JSON.parse(localStorage.getItem('tests') || '[]');
    
    // Add some mock tests if none exist
    if (storedTests.length === 0) {
      const mockTests = [
        {
          title: 'Mathematics Mid-Term Exam',
          subject: 'Mathematics',
          class: '10th A',
          chapter: 'Algebra & Geometry',
          testCode: 'TEST123',
          createdAt: '2025-01-15T10:00:00Z',
          timeLimit: 60,
          questions: [
            { type: 'mcq', marks: 2 },
            { type: 'mcq', marks: 2 },
            { type: 'short', marks: 3 },
            { type: 'essay', marks: 5 }
          ]
        },
        {
          title: 'Science Chapter 5 Quiz',
          subject: 'Science',
          class: '10th A',
          chapter: 'Light & Reflection',
          testCode: 'SCI456',
          createdAt: '2025-01-10T14:30:00Z',
          timeLimit: 45,
          questions: [
            { type: 'mcq', marks: 1 },
            { type: 'mcq', marks: 1 },
            { type: 'short', marks: 2 }
          ]
        },
        {
          title: 'English Literature Assessment',
          subject: 'English',
          class: '10th A',
          chapter: 'Poetry Analysis',
          testCode: 'ENG789',
          createdAt: '2025-01-08T09:00:00Z',
          timeLimit: 90,
          questions: [
            { type: 'mcq', marks: 2 },
            { type: 'essay', marks: 8 }
          ]
        }
      ];
      localStorage.setItem('tests', JSON.stringify(mockTests));
      setTests(mockTests);
    } else {
      setTests(storedTests);
    }
  }, []);

  const getTotalMarks = (questions: any[]) => {
    return questions.reduce((total, q) => total + q.marks, 0);
  };

  const getSubmissionCount = (testCode: string) => {
    // Mock submission count
    const counts: { [key: string]: number } = {
      'TEST123': 23,
      'SCI456': 18,
      'ENG789': 15
    };
    return counts[testCode] || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/teacher/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
              <SOSELogo />
              <div>
                <h1 className="text-xl font-bold text-gray-900">All Tests</h1>
                <p className="text-sm text-gray-600">Manage and view all your created tests</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tests.reduce((total, test) => total + getSubmissionCount(test.testCode), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tests.length > 0 ? Math.round(tests.reduce((total, test) => total + getSubmissionCount(test.testCode), 0) / tests.length) : 0}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tests Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Tests</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tests.map((test, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{test.title}</div>
                        <div className="text-sm text-gray-500">{test.subject}</div>
                        {test.chapter && <div className="text-xs text-gray-400">Chapter: {test.chapter}</div>}
                        <div className="text-xs text-gray-400">
                          Code: {test.testCode} • {test.questions.length} questions • {getTotalMarks(test.questions)} marks
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{test.class}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{formatDate(test.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {getSubmissionCount(test.testCode)} submissions
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate('/teacher/submissions')}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Submissions"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/teacher/analytics/${test.testCode}`)}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                          title="Analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/teacher/rankings/${test.testCode}`)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                          title="Rankings"
                        >
                          <Trophy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate('/teacher/reporthub')}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Report Cards"
                        >
                          <BookOpen className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate('/teacher/exports')}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="Export"
                        >
                          <FileDown className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTests;