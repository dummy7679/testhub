import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Home, Award, Clock, AlertTriangle } from 'lucide-react';
import SOSELogo from '../components/SOSELogo';

const SubmitTest: React.FC = () => {
  const navigate = useNavigate();
  const { testCode } = useParams<{ testCode: string }>();
  const [submission, setSubmission] = useState<any>(null);
  const [autoScore, setAutoScore] = useState<number>(0);
  const [totalMarks, setTotalMarks] = useState<number>(0);

  useEffect(() => {
    // Get submission from localStorage
    const submissionData = localStorage.getItem(`submission_${testCode}`);
    if (submissionData) {
      const parsed = JSON.parse(submissionData);
      setSubmission(parsed);
      
      // Calculate auto-score for MCQ questions
      calculateAutoScore(parsed.answers);
    }
  }, [testCode]);

  const calculateAutoScore = (answers: Record<string, string>) => {
    const mockCorrectAnswers = {
      'q1': '5',
      'q2': '11'
    };

    const mockMarks = {
      'q1': 2,
      'q2': 2,
      'q3': 3,
      'q4': 5
    };

    let score = 0;
    let total = 0;

    Object.entries(mockMarks).forEach(([questionId, marks]) => {
      total += marks;
      if (mockCorrectAnswers[questionId] && answers[questionId] === mockCorrectAnswers[questionId]) {
        score += marks;
      }
    });

    setAutoScore(score);
    setTotalMarks(total);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submission...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SOSELogo />
          </div>
        </div>

        {/* Success Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-8">
              Thank you, {submission.studentName}. Your test has been submitted for evaluation.
            </p>

            {/* Test Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Summary</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Auto-graded Score</p>
                    <p className="font-semibold text-gray-900">{autoScore} / {totalMarks} marks</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time Spent</p>
                    <p className="font-semibold text-gray-900">{formatTime(submission.timeSpent)}</p>
                  </div>
                </div>
                
                {submission.tabSwitchCount > 0 && (
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Tab Switches</p>
                      <p className="font-semibold text-gray-900">{submission.tabSwitchCount}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Subjective questions will be manually graded by your teacher. 
                Final results will be available soon.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Test Code: {testCode?.toUpperCase()}</p>
          <p className="text-sm mt-2">Submitted on {new Date(submission.submittedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default SubmitTest;