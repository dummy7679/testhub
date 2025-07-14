import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Database, 
  CheckSquare, 
  BarChart3, 
  Trophy, 
  FileDown, 
  Settings,
  BookOpen,
  LogOut
} from 'lucide-react';
import SOSELogo from '../../components/SOSELogo';
import { useTeacher } from '../../contexts/TeacherContext';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, teacher, setIsAuthenticated, setTeacher } = useTeacher();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/teacher/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setTeacher(null);
    localStorage.removeItem('teacherAuth');
    navigate('/');
  };

  const dashboardCards = [
    {
      title: 'All Tests',
      description: 'View and manage all your tests',
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      action: () => navigate('/teacher/tests')
    },
    {
      title: 'Create Test',
      description: 'Build new tests with various question types',
      icon: <Plus className="h-8 w-8 text-green-600" />,
      color: 'bg-green-50 border-green-200',
      action: () => navigate('/teacher/create')
    },
    {
      title: 'Question Bank',
      description: 'Manage your question library',
      icon: <Database className="h-8 w-8 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
      action: () => navigate('/teacher/bank')
    },
    {
      title: 'Submissions',
      description: 'Review student submissions and grade',
      icon: <CheckSquare className="h-8 w-8 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200',
      action: () => navigate('/teacher/submissions')
    },
    {
      title: 'Analytics',
      description: 'View detailed performance analytics',
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200',
      action: () => navigate('/teacher/analytics/test123')
    },
    {
      title: 'Rankings',
      description: 'Student performance leaderboards',
      icon: <Trophy className="h-8 w-8 text-yellow-600" />,
      color: 'bg-yellow-50 border-yellow-200',
      action: () => navigate('/teacher/rankings/test123')
    },
    {
      title: 'Report Cards',
      description: 'Generate and manage report cards',
      icon: <BookOpen className="h-8 w-8 text-teal-600" />,
      color: 'bg-teal-50 border-teal-200',
      action: () => navigate('/teacher/reporthub')
    },
    {
      title: 'Exports',
      description: 'Export data and generate reports',
      icon: <FileDown className="h-8 w-8 text-red-600" />,
      color: 'bg-red-50 border-red-200',
      action: () => navigate('/teacher/exports')
    },
    {
      title: 'Settings & Logs',
      description: 'Configure settings and view activity logs',
      icon: <Settings className="h-8 w-8 text-gray-600" />,
      color: 'bg-gray-50 border-gray-200',
      action: () => navigate('/teacher/settings')
    }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SOSELogo />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {teacher?.name} • {teacher?.school}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Tests</p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
              <CheckSquare className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-purple-600">156</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Questions in Bank</p>
                <p className="text-2xl font-bold text-orange-600">89</p>
              </div>
              <Database className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              onClick={card.action}
              className={`${card.color} p-6 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;