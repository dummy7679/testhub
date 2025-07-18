import React from 'react';

// Load MathJax for LaTeX rendering
if (typeof window !== 'undefined' && !window.MathJax) {
  const script = document.createElement('script');
  script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
  document.head.appendChild(script);

  const mathJaxScript = document.createElement('script');
  mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  mathJaxScript.async = true;
  document.head.appendChild(mathJaxScript);

  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']]
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
    }
  };
}

interface Question {
  id: string;
  type: 'mcq' | 'short' | 'essay';
  question: string;
  options?: string[];
  correct_answer?: string;
  marks: number;
}

interface QuestionRendererProps {
  question: Question;
  answer: string;
  onChange: (answer: string) => void;
  questionNumber: number;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  answer,
  onChange,
  questionNumber
}) => {
  // Trigger MathJax rendering after component updates
  React.useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [question.question]);

  const renderMCQ = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => (
        <label key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option}
            checked={answer === option}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span 
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: option }}
          />
        </label>
      ))}
    </div>
  );

  const renderShortAnswer = () => (
    <textarea
      value={answer}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your answer here..."
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
    />
  );

  const renderEssay = () => (
    <textarea
      value={answer}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write your essay here..."
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
    />
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Question {questionNumber}
        </h3>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
          {question.marks} marks
        </span>
      </div>
      
      <div className="mb-6">
        <div 
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question.question }}
        />
      </div>

      <div className="space-y-4">
        {question.type === 'mcq' && renderMCQ()}
        {question.type === 'short' && renderShortAnswer()}
        {question.type === 'essay' && renderEssay()}
      </div>
    </div>
  );
};

export default QuestionRenderer;