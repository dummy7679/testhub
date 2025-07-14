import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, User } from 'lucide-react';
import SOSELogo from '../components/SOSELogo';
import { database } from '../lib/database';

const JoinTest: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    testCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate test code validation
      if (!formData.name.trim()) {
        throw new Error('Please enter your name');
      }
      
      if (!formData.testCode.trim()) {
        throw new Error('Please enter test code');
      }

      // Validate test code against database
      const test = await database.getTestByCode(formData.testCode);
      
      if (!test) {
        throw new Error('Invalid test code or test has expired');
      }

      // Store student info in localStorage for demo
      localStorage.setItem('studentName', formData.name);
      localStorage.setItem('testCode', formData.testCode);
      
      // Navigate to test
      navigate(`/test/start/${formData.testCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>
          <SOSELogo />
        </div>

        {/* Main Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Join Test
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Test Code Field */}
              <div>
                <label htmlFor="testCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="testCode"
                    value={formData.testCode}
                    onChange={(e) => setFormData({ ...formData, testCode: e.target.value.toUpperCase() })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter test code"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Joining Test...' : 'Join Test'}
              </button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>How to join:</strong><br />
                • Get the test code from your teacher<br />
                • Enter your full name as it appears in records<br />
                • Click "Join Test" to start
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTest;