import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Clock, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import SOSELogo from '../../components/SOSELogo';

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { testCode } = useParams<{ testCode: string }>();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics = {
      testTitle: 'Mathematics Mid-Term Exam',
      totalSubmissions: 25,
      averageScore: 78.5,
      averageTime: 45,
      maxScore: 95,
      minScore: 42,
      scoreDistribution: [
        { range: '0-20', count: 1 },
        { range: '21-40', count: 2 },
        { range: '41-60', count: 6 },
        { range: '61-80', count: 12 },
        { range: '81-100', count: 4 }
      ],
      questionWiseAccuracy: [
        { question: 'Q1', accuracy: 85, topic: 'Algebra' },
        { question: 'Q2', accuracy: 72, topic: 'Geometry' },
        { question: 'Q3', accuracy: 68, topic: 'Algebra' },
        { question: 'Q4', accuracy: 45, topic: 'Geometry' }
      ],
      topicWisePerformance: [
        { topic: 'Algebra', avgScore: 76, totalQuestions: 2 },
        { topic: 'Geometry', avgScore: 58, totalQuestions: 2 }
      ],
      submissionTrend: [
        { time: '10:00', submissions: 3 },
        { time: '10:30', submissions: 7 },
        { time: '11:00', submissions: 12 },
        { time: '11:30', submissions: 8 },
        { time: '12:00', submissions: 5 }
      ]
    };
    setAnalytics(mockAnalytics);
  }, [testCode]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/teacher/tests')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Tests</span>
              </button>
              <SOSELogo />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-600">{analytics.testTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalSubmissions}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Time</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageTime}min</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Range</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.minScore}-{analytics.maxScore}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Score Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Topic-wise Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic-wise Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.topicWisePerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ topic, avgScore }) => `${topic}: ${avgScore}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="avgScore"
                >
                  {analytics.topicWisePerformance.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Question-wise Analysis */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Question Accuracy */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question-wise Accuracy</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.questionWiseAccuracy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Submission Trend */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.submissionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="submissions" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Question Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.questionWiseAccuracy.map((question: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {question.question}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {question.topic}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${question.accuracy}%` }}
                          ></div>
                        </div>
                        {question.accuracy}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        question.accuracy > 80 ? 'bg-green-100 text-green-800' :
                        question.accuracy > 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.accuracy > 80 ? 'Easy' : question.accuracy > 60 ? 'Medium' : 'Hard'}
                      </span>
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

export default Analytics;