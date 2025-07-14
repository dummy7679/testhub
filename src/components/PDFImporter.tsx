import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { pdfImporter, ImportedQuestion } from '../lib/pdfImporter';

interface PDFImporterProps {
  onImport: (questions: ImportedQuestion[]) => void;
  onClose: () => void;
}

const PDFImporter: React.FC<PDFImporterProps> = ({ onImport, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [importing, setImporting] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState<ImportedQuestion[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handlePreview = async () => {
    if (!file || !subject) {
      alert('Please select a file and enter subject');
      return;
    }

    setImporting(true);
    try {
      const questions = await pdfImporter.importQuestionsFromPDF(file, subject, topic);
      setPreviewQuestions(questions);
      setShowPreview(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import questions');
    } finally {
      setImporting(false);
    }
  };

  const handleConfirmImport = () => {
    onImport(previewQuestions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Import Questions from PDF</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!showPreview ? (
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select PDF File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click to select PDF file</p>
                  {file && (
                    <p className="text-green-600 mt-2 flex items-center justify-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {file.name}
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Subject and Topic */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mathematics, Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic (Optional)
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Algebra, Geometry"
                />
              </div>
            </div>

            {/* Format Guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">PDF Format Guidelines:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Number questions: 1., 2., Q1, Q2, etc.</p>
                <p>• MCQ options: a), b), c), d) or (a), (b), (c), (d)</p>
                <p>• Mark correct answer: "Answer: b" or "Ans: b"</p>
                <p>• Specify marks: [2 marks] or (2 marks)</p>
                <p>• Difficulty: Include "Easy", "Medium", or "Hard"</p>
              </div>
            </div>

            {/* Template Download */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Sample Format:</h3>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
{pdfImporter.getQuestionTemplate()}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePreview}
                disabled={!file || !subject || importing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {importing ? 'Processing...' : 'Preview Questions'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Preview: {previewQuestions.length} questions found
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Upload
              </button>
            </div>

            {/* Questions Preview */}
            <div className="max-h-96 overflow-y-auto space-y-4">
              {previewQuestions.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Q{index + 1}</span>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        question.type === 'mcq' ? 'bg-blue-100 text-blue-800' :
                        question.type === 'short' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {question.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {question.marks} marks
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-900 mb-2">{question.question}</p>
                  
                  {question.type === 'mcq' && question.options && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className={`p-2 rounded text-sm ${
                          option === question.correct_answer 
                            ? 'bg-green-100 text-green-800 font-medium' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {String.fromCharCode(97 + optIndex)}) {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Confirm Import */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Import {previewQuestions.length} Questions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFImporter;