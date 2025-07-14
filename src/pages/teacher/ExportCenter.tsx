import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Database, Key, Calendar, Filter } from 'lucide-react';
import SOSELogo from '../../components/SOSELogo';

const ExportCenter: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    test: '',
    class: '',
    startDate: '',
    endDate: ''
  });

  const mockTests = [
    { code: 'TEST123', title: 'Mathematics Mid-Term Exam' },
    { code: 'SCI456', title: 'Science Chapter 5 Quiz' },
    { code: 'ENG789', title: 'English Literature Assessment' }
  ];

  const exportOptions = [
    {
      id: 'scores',
      title: 'Student Scores',
      description: 'Export student scores and basic performance data',
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      format: 'CSV, Excel',
      fields: ['Student Name', 'Class', 'Score', 'Percentage', 'Grade', 'Submission Time']
    },
    {
      id: 'submissions',
      title: 'Full Submissions',
      description: 'Export complete student submissions including answers',
      icon: <Database className="h-8 w-8 text-green-600" />,
      format: 'CSV, Excel, JSON',
      fields: ['Student Name', 'All Answers', 'Timestamps', 'Security Events', 'IP Address']
    },
    {
      id: 'analytics',
      title: 'Test Analytics',
      description: 'Export detailed test analytics and statistics',
      icon: <Key className="h-8 w-8 text-purple-600" />,
      format: 'Excel, PDF',
      fields: ['Question-wise Analysis', 'Performance Metrics', 'Time Statistics', 'Difficulty Analysis']
    }
  ];

  const handleExport = (type: string, format: string) => {
    if (!filters.test) {
      alert('Please select a test to export');
      return;
    }

    // Mock export process
    const testName = mockTests.find(t => t.code === filters.test)?.title || 'Test';
    const filename = `${testName}_${type}.${format.toLowerCase()}`;
    
    // Simulate file generation
    setTimeout(() => {
      alert(`Export completed: ${filename}`);
    }, 1000);
  };

  const getExportData = (type: string) => {
    // Mock data for demonstration
    const mockData = {
      scores: [
        ['Ananya Gupta', '10th A', '95', '95%', 'A+', '2025-01-15 11:30:00'],
        ['Arjun Mehta', '10th A', '92', '92%', 'A', '2025-01-15 11:45:00'],
        ['Kavya Sharma', '10th A', '88', '88%', 'A-', '2025-01-15 12:00:00']
      ],
      submissions: [
        ['Ananya Gupta', 'Q1: 5, Q2: 11, Q3: y=7...', '2025-01-15 11:30:00', '0 tab switches', '192.168.1.1'],
        ['Arjun Mehta', 'Q1: 5, Q2: 9, Q3: y=7...', '2025-01-15 11:45:00', '1 tab switch', '192.168.1.2']
      ],
      analytics: [
        ['Question 1', '85%', 'Easy', '2 marks'],
        ['Question 2', '72%', 'Medium', '2 marks'],
        ['Question 3', '68%', 'Medium', '3 marks'],
        ['Question 4', '45%', 'Hard', '5 marks']
      ]
    };
    
    return mockData[type as keyof typeof mockData] || [];
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
                <h1 className="text-xl font-bold text-gray-900">Export Center</h1>
                <p className="text-sm text-gray-600">Export test data and generate reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Export Filters</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Test
              </label>
              <select
                value={filters.test}
                onChange={(e) => setFilters({ ...filters, test: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Tests</option>
                {mockTests.map(test => (
                  <option key={test.code} value={test.code}>
                    {test.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <select
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Classes</option>
                <option value="10th A">10th A</option>
                <option value="10th B">10th B</option>
                <option value="10th C">10th C</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exportOptions.map((option) => (
            <div key={option.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0">
                  {option.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Available Formats:</p>
                <p className="text-sm text-gray-600">{option.format}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {option.fields.map((field, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{field}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                {option.format.split(', ').map((format) => (
                  <button
                    key={format}
                    onClick={() => handleExport(option.id, format)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export as {format}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Exports */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Exports</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {[
              { file: 'Mathematics_Mid_Term_Scores.csv', type: 'Scores', date: '2025-01-15T14:30:00Z', size: '2.3 KB' },
              { file: 'Science_Quiz_Submissions.xlsx', type: 'Submissions', date: '2025-01-15T13:45:00Z', size: '15.7 KB' },
              { file: 'English_Assessment_Analytics.pdf', type: 'Analytics', date: '2025-01-15T12:20:00Z', size: '890 KB' }
            ].map((export_, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{export_.file}</h3>
                      <p className="text-sm text-gray-600">{export_.type} • {export_.size}</p>
                      <p className="text-xs text-gray-500 flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(export_.date).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                  
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportCenter;