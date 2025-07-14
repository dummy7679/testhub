import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Search, Filter, Upload } from 'lucide-react';
import SOSELogo from '../../components/SOSELogo';
import PDFImporter from '../../components/PDFImporter';
import LaTeXEditor from '../../components/LaTeXEditor';
import { useTeacher } from '../../contexts/TeacherContext';
import { database } from '../../lib/database';
import type { ImportedQuestion } from '../../lib/pdfImporter';

const QuestionBank: React.FC = () => {
  const navigate = useNavigate();
  const { teacher } = useTeacher();
  const [questions, setQuestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: 'mcq' as 'mcq' | 'short' | 'essay',
    subject: '',
    topic: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    options: ['', '', '', ''],
    correct_answer: '',
    marks: 1
  });

  useEffect(() => {
    if (teacher) {
      loadQuestions();
    }
  }, [teacher]);

  const loadQuestions = async () => {
    try {
      if (!teacher) return;
      const teacherQuestions = await database.getTeacherQuestions(teacher.id);
      setQuestions(teacherQuestions);
    } catch (error) {
      console.error('Failed to load questions:', error);
      // Fallback to mock data for demo
      const mockQuestions = [
        {
          id: 1,
          question: 'What is the value of $x$ in the equation $2x + 5 = 15$?',
          type: 'mcq',
          subject: 'Mathematics',
          topic: 'Algebra',
          difficulty: 'Easy',
          options: ['3', '5', '10', '15'],
          correct_answer: '5',
          marks: 2,
          created_at: '2025-01-15T10:00:00Z'
        },
        {
          id: 2,
          question: 'Calculate $\\int_{0}^{1} x^2 dx$',
          type: 'short',
          subject: 'Mathematics',
          topic: 'Calculus',
          difficulty: 'Medium',
          marks: 3,
          created_at: '2025-01-15T11:00:00Z'
        }
      ];
      setQuestions(mockQuestions);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || q.type === filterType;
    const matchesSubject = filterSubject === 'all' || q.subject === filterSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const handleImportQuestions = async (importedQuestions: ImportedQuestion[]) => {
    try {
      if (!teacher) return;
      
      for (const question of importedQuestions) {
        await database.addQuestion({
          teacher_id: teacher.id,
          ...question
        });
      }
      
      // Reload questions
      await loadQuestions();
      alert(`Successfully imported ${importedQuestions.length} questions!`);
    } catch (error) {
      console.error('Failed to import questions:', error);
      alert('Failed to import questions. Please try again.');
    }
  };

  const handleAddQuestion = async () => {
    try {
      if (!teacher) return;
      
      await database.addQuestion({
        teacher_id: teacher.id,
        question: newQuestion.question,
        type: newQuestion.type,
        subject: newQuestion.subject,
        topic: newQuestion.topic,
        difficulty: newQuestion.difficulty,
        options: newQuestion.type === 'mcq' ? newQuestion.options : undefined,
        correct_answer: newQuestion.type === 'mcq' ? newQuestion.correct_answer : undefined,
        marks: newQuestion.marks
      });
      
      // Reset form and reload
      setNewQuestion({
        question: '',
        type: 'mcq',
        subject: '',
        topic: '',
        difficulty: 'Medium',
        options: ['', '', '', ''],
        correct_answer: '',
        marks: 1
      });
      setShowAddModal(false);
      await loadQuestions();
      alert('Question added successfully!');
    } catch (error) {
      console.error('Failed to add question:', error);
      alert('Failed to add question. Please try again.');
    }
  };

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
            
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Import from PDF</span>
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
                              option === question.correct_answer 
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
                      Created: {new Date(question.created_at).toLocaleDateString()}
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

        {/* Add Question Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Add New Question</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={newQuestion.subject}
                      onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={newQuestion.topic}
                      onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Algebra"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={newQuestion.type}
                      onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="mcq">Multiple Choice</option>
                      <option value="short">Short Answer</option>
                      <option value="essay">Essay</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marks
                    </label>
                    <input
                      type="number"
                      value={newQuestion.marks}
                      onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question (LaTeX supported)
                  </label>
                  <LaTeXEditor
                    value={newQuestion.question}
                    onChange={(value) => setNewQuestion({ ...newQuestion, question: value })}
                    placeholder="Enter your question with LaTeX math: $x^2 + y^2 = z^2$"
                  />
                </div>

                {newQuestion.type === 'mcq' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    <div className="space-y-2">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="correct-answer"
                            checked={newQuestion.correct_answer === option}
                            onChange={() => setNewQuestion({ ...newQuestion, correct_answer: option })}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = e.target.value;
                              setNewQuestion({ ...newQuestion, options: newOptions });
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PDF Import Modal */}
        {showImportModal && (
          <PDFImporter
            onImport={handleImportQuestions}
            onClose={() => setShowImportModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionBank;