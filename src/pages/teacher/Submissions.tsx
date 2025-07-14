import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import SOSELogo from '../../components/SOSELogo';

const Submissions: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);

  const mockTests = [
    { code: 'TEST123', title: 'Mathematics Mid-Term Exam' },
    { code: 'SCI456', title: 'Science Chapter 5 Quiz' },
    { code: 'ENG789', title: 'English Literature Assessment' }
  ];

  const mockSubmissions = [
    {
      id: 1,
      studentName: 'Rahul Sharma',
      testCode: 'TEST123',
      submittedAt: '2025-01-15T11:30:00Z',
      autoScore: 7,
      totalMarks: 12,
      timeSpent: 45,
      status: 'unchecked',
      answers: {
        'q1': '5',
        'q2': '11',
        'q3': 'To solve 3y - 7 = 14, I add 7 to both sides: 3y = 21, then divide by 3: y = 7',
        'q4': 'The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides (a² + b² = c²). For example, if a ladder leans against a wall, we can find the required ladder length using this theorem.'
      }
    },
    {
      id: 2,
      studentName: 'Priya Patel',
      testCode: 'TEST123',
      submittedAt: '2025-01-15T11:45:00Z',
      autoScore: 4,
      totalMarks: 12,
      timeSpent: 52,
      status: 'checked',
      answers: {
        'q1': '3',
        'q2': '11',
        'q3': '3y - 7 = 14, so y = 7',
        'q4': 'The Pythagorean theorem is used in right triangles.'
      }
    },
    {
      id: 3,
      studentName: 'Amit Kumar',
      testCode: 'TEST123',
      submittedAt: '2025-01-15T12:00:00Z',
      autoScore: 4,
      totalMarks: 12,
      timeSpent: 38,
      status: 'unchecked',
      answers: {
        'q1': '5',
        'q2': '9',
        'q3': 'Add 7 to both sides: 3y = 21, divide by 3: y = 7',
        'q4': 'Pythagorean theorem: a² + b² = c². Used in construction and navigation.'
      }
    }
  ];

  useEffect(() => {
    if (selectedTest) {
      const filteredSubmissions = mockSubmissions.filter(sub => sub.testCode === selectedTest);
      setSubmissions(filteredSubmissions);
    }
  }, [selectedTest]);

  const handleGradeSubmission = (submission: any) => {
    setSelectedSubmission(submission);
    setShowGradingModal(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    return status === 'checked' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'checked' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />;
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
                <h1 className="text-xl font-bold text-gray-900">Submissions</h1>
                <p className="text-sm text-gray-600">Review and grade student submissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Test Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Test</h2>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a test...</option>
            {mockTests.map(test => (
              <option key={test.code} value={test.code}>
                {test.title} ({test.code})
              </option>
            ))}
          </select>
        </div>

        {/* Submissions List */}
        {selectedTest && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Submissions for {mockTests.find(t => t.code === selectedTest)?.title}
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                            <div className="text-sm text-gray-500">ID: {submission.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{submission.autoScore} / {submission.totalMarks}</div>
                        <div className="text-sm text-gray-500">{Math.round((submission.autoScore / submission.totalMarks) * 100)}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(submission.timeSpent * 60)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span className="ml-1">{submission.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleGradeSubmission(submission)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grading Modal */}
        {showGradingModal && selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Grade Submission</h2>
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Student: <span className="font-semibold">{selectedSubmission.studentName}</span></p>
                <p className="text-sm text-gray-600">Auto Score: <span className="font-semibold">{selectedSubmission.autoScore}/{selectedSubmission.totalMarks}</span></p>
              </div>

              <div className="space-y-6">
                {Object.entries(selectedSubmission.answers).map(([questionId, answer], index) => (
                  <div key={questionId} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Question {index + 1}</h3>
                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <p className="text-sm text-gray-700">{answer}</p>
                    </div>
                    {questionId === 'q3' || questionId === 'q4' ? (
                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">Manual Grade:</label>
                        <input
                          type="number"
                          min="0"
                          max={questionId === 'q3' ? 3 : 5}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                        <span className="text-sm text-gray-500">/ {questionId === 'q3' ? 3 : 5} marks</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        Auto-graded: {(questionId === 'q1' && answer === '5') || (questionId === 'q2' && answer === '11') ? 'Correct' : 'Incorrect'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Mock save grades
                    alert('Grades saved successfully!');
                    setShowGradingModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Grades
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;