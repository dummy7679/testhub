import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import SOSELogo from '../../components/SOSELogo';

const QuestionBank: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  useEffect(() => {
    // Mock questions data
    const mockQuestions = [
      {
        id: 1,
        question: 'What is the value of x in the equation 2x + 5 = 15?',
        type: 'mcq',
        subject: 'Mathematics',
        topic: 'Algebra',
        difficulty: 'Easy',
        options: ['3', '5', '10', '15'],
        correctAnswer: '5',
        marks: 2,
        createdAt: '2025-01-15T10:00:00Z'
      },
      {
        id: 2,
        question: 'Which of the following is a prime number?',
        type: 'mcq',
        subject: 'Mathematics',
        topic: 'Number Theory',
        difficulty: 'Easy',
        options: ['4', '6', '9', '11'],
        correctAnswer: '11',
        marks: 2,
        createdAt: '2025-01-15T10:30:00Z'
      },
      {
        id: 3,
        question: 'Solve for y: 3y - 7 = 14. Show your work.',
        type: 'short',
        subject: 'Mathematics',
        topic: 'Algebra',
        difficulty: 'Medium',
        marks: 3,
        createdAt: '2025-01-15T11:00:00Z'
      },
      {
        id: 4,
        question: 'What is photosynthesis and why is it important for life on Earth?',
        type: 'short',
        subject: 'Science',
        topic: 'Biology',
        difficulty: 'Medium',
        marks: 4,
        createdAt: '2025-01-15T11:30:00Z'
      },
      {
        id: 5,
        question: 'Explain the Pythagorean theorem and provide an example of its application in real life.',
        type: 'essay',
        subject: 'Mathematics',
        topic: 'Geometry',
        difficulty: 'Hard',
        marks: 5,
        createdAt: '2025-01-15T12:00:00Z'
      }
    ];
    setQuestions(mockQuestions);
  }, []);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || q.type === filterType;
    const matchesSubject = filterSubject === 'all' || q.subject === filterSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const handleDeleteQuestion = (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mcq': return 'bg-blue-100 text-blue-800';
      case 'short': return 'bg-purple-100 text-purple-800';
      case 'essay': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq': return 'Multiple Choice';
      case 'short': return 'Short Answer';
      case 'essay': return 'Essay';
      default: return type;
    }
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
                <h1 className="text-xl font-bold text-gray-900">Question Bank</h1>
                <p className="text-sm text-gray-600">Manage your question library</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
              </div>
              <div className="text-blue-600 text-2xl">📚</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">MCQ Questions</p>
                <p className="text-2xl font-bold text-gray-900">{questions.filter(q => q.type === 'mcq').length}</p>
              </div>
              <div className="text-green-600 text-2xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Short Answer</p>
                <p className="text-2xl font-bold text-gray-900">{questions.filter(q => q.type === 'short').length}</p>
              </div>
              <div className="text-purple-600 text-2xl">📝</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Essay Questions</p>
                <p className="text-2xl font-bold text-gray-900">{questions.filter(q => q.type === 'essay').length}</p>
              </div>
              <div className="text-orange-600 text-2xl">📄</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="mcq">Multiple Choice</option>
              <option value="short">Short Answer</option>
              <option value="essay">Essay</option>
            </select>
            
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
            </select>
            
            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Questions ({filteredQuestions.length})</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <div key={question.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                        {getTypeLabel(question.type)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{question.subject} • {question.topic}</span>
                      <span className="text-sm text-gray-500">{question.marks} marks</span>
                    </div>
                    
                    <p className="text-gray-900 font-medium mb-2">{question.question}</p>
                    
                    {question.type === 'mcq' && (
                      <div className="mt-2">
                        <div className="grid grid-cols-2 gap-2">
                          {question.options.map((option: string, index: number) => (
                            <div key={index} className={`p-2 rounded text-sm ${
                              option === question.correctAnswer 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-gray-500">
                      Created: {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setEditingQuestion(question)}
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;