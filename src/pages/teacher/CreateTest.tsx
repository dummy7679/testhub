import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Eye } from 'lucide-react';
import SOSELogo from '../../components/SOSELogo';
import LaTeXEditor from '../../components/LaTeXEditor';
import { useTeacher } from '../../contexts/TeacherContext';
import { database } from '../../lib/database';

const CreateTest: React.FC = () => {
  const navigate = useNavigate();
  const { teacher } = useTeacher();
  const [testData, setTestData] = useState({
    title: '',
    subject: '',
    class: '',
    chapter: '',
    timeLimit: 60,
    maxAttempts: 1,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    showAnswerKey: false,
    showTimer: true,
    randomizeQuestions: false
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1
    }
  ]);

  const [activeQuestion, setActiveQuestion] = useState(0);

  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1
    };
    setQuestions([...questions, newQuestion]);
    setActiveQuestion(questions.length);
  };

  const deleteQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      setActiveQuestion(Math.max(0, activeQuestion - 1));
    }
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!teacher) {
        throw new Error('You must be logged in to create a test');
      }

      // Validate form
      if (!testData.title.trim()) {
        throw new Error('Please enter a test title');
      }
      
      if (questions.some(q => !q.question.trim())) {
        throw new Error('Please fill in all question fields');
      }
      
      if (questions.some(q => q.type === 'mcq' && (!q.correctAnswer || q.options.some(opt => !opt.trim())))) {
        throw new Error('Please complete all MCQ options and select correct answers');
      }
      
      // Generate unique test code
      const testCode = Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Prepare test data for database
      const newTestData = {
        teacher_id: teacher.id,
        ...testData,
        testCode,
        test_code: testCode,
        questions: questions.map(q => ({
          id: q.id.toString(),
          type: q.type,
          question: q.question,
          options: q.options,
          correct_answer: q.correctAnswer,
          marks: q.marks
        })),
        settings: {
          showAnswerKey: testData.showAnswerKey,
          showTimer: testData.showTimer,
          randomizeQuestions: testData.randomizeQuestions,
          maxAttempts: testData.maxAttempts,
          startDate: testData.startDate,
          startTime: testData.startTime,
          endDate: testData.endDate,
          endTime: testData.endTime
        }
      };

      // Save to database
      await database.createTest(newTestData);

      // Show success message with better UX
      const successDiv = document.createElement('div');
      successDiv.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 class="text-lg font-bold text-green-600 mb-2">✅ Test Created Successfully!</h3>
            <p class="text-gray-700 mb-4">Test Code: <strong class="text-blue-600">${testCode}</strong></p>
            <button onclick="this.parentElement.parentElement.remove()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Continue
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        if (successDiv.parentElement) {
          successDiv.remove();
        }
      }, 5000);
      
      navigate('/teacher/tests');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const currentQuestion = questions[activeQuestion];

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
                <h1 className="text-xl font-bold text-gray-900">Create New Test</h1>
                <p className="text-sm text-gray-600">Build your test with various question types</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Test Settings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Test Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Title
                    </label>
                    <input
                      type="text"
                      value={testData.title}
                      onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter test title"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={testData.subject}
                        onChange={(e) => setTestData({ ...testData, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Subject"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class
                      </label>
                      <input
                        type="text"
                        value={testData.class}
                        onChange={(e) => setTestData({ ...testData, class: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Class"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chapter
                    </label>
                    <input
                      type="text"
                      value={testData.chapter}
                      onChange={(e) => setTestData({ ...testData, chapter: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Chapter/Topic"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={testData.timeLimit}
                      onChange={(e) => setTestData({ ...testData, timeLimit: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={testData.showAnswerKey}
                        onChange={(e) => setTestData({ ...testData, showAnswerKey: e.target.checked })}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Show answer key after submission</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={testData.showTimer}
                        onChange={(e) => setTestData({ ...testData, showTimer: e.target.checked })}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Show timer during test</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={testData.randomizeQuestions}
                        onChange={(e) => setTestData({ ...testData, randomizeQuestions: e.target.checked })}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Randomize question order</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Question</span>
                  </button>
                </div>

                {/* Question Navigation */}
                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveQuestion(index)}
                      className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ${
                        activeQuestion === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Q{index + 1}
                    </button>
                  ))}
                </div>

                {/* Question Editor */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium text-gray-900">
                      Question {activeQuestion + 1}
                    </h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteQuestion(activeQuestion)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Type
                      </label>
                      <select
                        value={currentQuestion.type}
                        onChange={(e) => updateQuestion(activeQuestion, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="mcq">Multiple Choice</option>
                        <option value="short">Short Answer</option>
                        <option value="essay">Essay</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marks
                      </label>
                      <input
                        type="number"
                        value={currentQuestion.marks}
                        onChange={(e) => updateQuestion(activeQuestion, 'marks', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </label>
                    <LaTeXEditor
                      value={currentQuestion.question}
                      onChange={(value) => updateQuestion(activeQuestion, 'question', value)}
                      placeholder="Enter your question here..."
                    />
                  </div>

                  {currentQuestion.type === 'mcq' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${activeQuestion}`}
                              checked={currentQuestion.correctAnswer === option}
                              onChange={() => updateQuestion(activeQuestion, 'correctAnswer', option)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(activeQuestion, index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Option ${index + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Creating Test...' : 'Create Test'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;