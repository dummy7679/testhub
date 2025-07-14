import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, BarChart3, FileDown, Trophy, BookOpen, Calendar, Users } from 'lucide-react';
import SOSELogo from '../../components/SOSELogo';
import { useTeacher } from '../../contexts/TeacherContext';
import { database } from '../../lib/database';

const AllTests: React.FC = () => {
  const navigate = useNavigate();
  const { teacher } = useTeacher();
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teacher) {
      loadTests();
    }
  }, [teacher]);

  const loadTests = async () => {
    try {
      if (!teacher) return;
      const teacherTests = await database.getTeacherTests(teacher.id);
      setTests(teacherTests);
    } catch (error) {
      console.error('Failed to load tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalMarks = (questions: any[]) => {
    return questions.reduce((total, q) => total + q.marks, 0);
  };

  const getSubmissionCount = (testCode: string) => {
    // This would be loaded from database in real implementation
    return Math.floor(Math.random() * 30) + 5; // Mock for now
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
                          Code: {test.test_code} • {test.questions.length} questions • {getTotalMarks(test.questions)} marks
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{test.class}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{formatDate(test.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {getSubmissionCount(test.test_code)} submissions
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
                          onClick={() => navigate(`/teacher/analytics/${test.id}`)}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                          title="Analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/teacher/rankings/${test.id}`)}
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