import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, Shield } from 'lucide-react';
import SOSELogo from '../components/SOSELogo';
import { useTeacher } from '../contexts/TeacherContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { showDashboardButton, setShowDashboardButton, setIsAuthenticated } = useTeacher();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        setShowDashboardButton(true);
        // Show a subtle notification
        const notification = document.createElement('div');
        notification.textContent = 'Teacher Dashboard Access Enabled';
        notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity';
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowDashboardButton]);

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Smart Testing",
      description: "Advanced question types with auto-grading and detailed analytics"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Easy Access",
      description: "Simple test code entry - no account required for students"
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Comprehensive Analytics",
      description: "Detailed performance insights and automated report generation"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Secure Environment",
      description: "Advanced security features to ensure test integrity"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <SOSELogo className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to SOSE TestHub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Global Smart Test Platform designed for modern education. 
            Secure, efficient, and accessible testing for everyone.
          </p>
        </div>

        {/* Main Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => navigate('/test')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Take Test
          </button>
          
          {showDashboardButton && (
            <button
              onClick={() => navigate('/teacher/login')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-pulse"
            >
              Teacher Dashboard
            </button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-blue-800">
              <strong>For Teachers:</strong> Press <kbd className="px-2 py-1 bg-blue-100 rounded font-mono">Ctrl + Alt + T</kbd> to access the Teacher Dashboard
            </p>
          </div>
          <p className="text-gray-600">
            © 2025 SOSE TestHub - Lajpat Nagar. Built for the future of education.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Designed by Aftab Alam, Class 10th A
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;