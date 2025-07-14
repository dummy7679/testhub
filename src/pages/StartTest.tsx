import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTest } from '../contexts/TestContext';
import SOSELogo from '../components/SOSELogo';
import Timer from '../components/Timer';
import QuestionRenderer from '../components/QuestionRenderer';

const StartTest: React.FC = () => {
  const navigate = useNavigate();
  const { testCode } = useParams<{ testCode: string }>();
  const { 
    currentTest, 
    setCurrentTest, 
    answers, 
    setAnswers,
    timeRemaining,
    setTimeRemaining,
    currentQuestion,
    setCurrentQuestion,
    tabSwitchCount,
    setIsTestActive
  } = useTest();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock test data
  const mockTest = {
    id: 'test-123',
    title: testCode?.toUpperCase() === 'TEST123' ? 'Mathematics Mid-Term Exam' :
           testCode?.toUpperCase() === 'DEMO123' ? 'Sample Quiz' :
           testCode?.toUpperCase() === 'MATH001' ? 'Algebra Test' :
           testCode?.toUpperCase() === 'SCI456' ? 'Science Quiz' :
           testCode?.toUpperCase() === 'ENG789' ? 'English Assessment' : 'Sample Test',
    subject: 'Mathematics',
    chapter: 'Algebra & Geometry',
    timeLimit: 3600, // 1 hour
    questions: [
      {
        id: 'q1',
        type: 'mcq' as const,
        question: 'What is the value of x in the equation 2x + 5 = 15?',
        options: ['3', '5', '10', '15'],
        correct_answer: '5',
        marks: 2
      },
      {
        id: 'q2',
        type: 'mcq' as const,
        question: 'Which of the following is a prime number?',
        options: ['4', '6', '9', '11'],
        correct_answer: '11',
        marks: 2
      },
      {
        id: 'q3',
        type: 'short' as const,
        question: 'Solve for y: 3y - 7 = 14. Show your work.',
        marks: 3
      },
      {
        id: 'q4',
        type: 'essay' as const,
        question: 'Explain the Pythagorean theorem and provide an example of its application in real life.',
        marks: 5
      }
    ]
  };

  useEffect(() => {
    // Initialize test
    setCurrentTest(mockTest);
    setTimeRemaining(mockTest.timeLimit);
    setIsTestActive(true);
    
    // Get student name from localStorage
    const studentName = localStorage.getItem('studentName');
    if (!studentName) {
      navigate('/test');
    }
  }, [setCurrentTest, setTimeRemaining, setIsTestActive, navigate]);

  useEffect(() => {
    // Auto-submit when time runs out
    if (timeRemaining <= 0) {
      if (!isSubmitting) {
        handleSubmit();
      }
    }
  }, [timeRemaining, isSubmitting]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setIsTestActive(false);

    try {
      // Mock submission
      const submission = {
        studentName: localStorage.getItem('studentName'),
        testCode,
        answers,
        submittedAt: new Date().toISOString(),
        tabSwitchCount,
        timeSpent: mockTest.timeLimit - timeRemaining
      };

      // Store submission in localStorage for demo
      localStorage.setItem(`submission_${testCode}`, JSON.stringify(submission));

      navigate(`/test/submit/${testCode}`);
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const isAnswered = (questionId: string) => {
    return answers[questionId] && answers[questionId].trim() !== '';
  };

  if (!currentTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  const currentQ = currentTest.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SOSELogo className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentTest.title}</h1>
                <p className="text-sm text-gray-600">{currentTest.subject} • {currentTest.chapter}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {tabSwitchCount > 0 && (
                <div className="flex items-center space-x-2 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">{tabSwitchCount} tab switch{tabSwitchCount > 1 ? 'es' : ''} detected</span>
                </div>
              )}
              
              <Timer />
              
              <div className="text-sm text-gray-600">
                {getAnsweredCount()} / {currentTest.questions.length} answered
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Question Navigation</h3>
              <div className="grid grid-cols-4 gap-2">
                {currentTest.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                      index === currentQuestion
                        ? 'bg-blue-600 text-white'
                        : isAnswered(currentTest.questions[index].id)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 rounded-full"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 rounded-full"></div>
                  <span className="text-gray-600">Not answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-600">Current</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Tip:</strong> Click on question numbers to jump directly to any question
                </p>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <QuestionRenderer
              question={currentQ}
              answer={answers[currentQ.id] || ''}
              onChange={(answer) => handleAnswerChange(currentQ.id, answer)}
              questionNumber={currentQuestion + 1}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-4">
                {currentQuestion === currentTest.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Test'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion(Math.min(currentTest.questions.length - 1, currentQuestion + 1))}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartTest;