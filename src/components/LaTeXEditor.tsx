import React, { useState, useEffect } from 'react';
import { Eye, BookOpen, X } from 'lucide-react';

interface LaTeXEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const LaTeXEditor: React.FC<LaTeXEditorProps> = ({ value, onChange, placeholder }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Load MathJax for LaTeX rendering
  useEffect(() => {
    if (!window.MathJax) {
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
  }, []);

  const renderLatex = (text: string) => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      setTimeout(() => {
        window.MathJax.typesetPromise();
      }, 100);
    }
    return text;
  };

  const mathSymbols = [
    { symbol: '\\frac{a}{b}', description: 'Fraction' },
    { symbol: 'x^2', description: 'Superscript' },
    { symbol: 'x_1', description: 'Subscript' },
    { symbol: '\\sqrt{x}', description: 'Square root' },
    { symbol: '\\sum_{i=1}^{n}', description: 'Summation' },
    { symbol: '\\int_{a}^{b}', description: 'Integral' },
    { symbol: '\\alpha, \\beta, \\gamma', description: 'Greek letters' },
    { symbol: '\\sin, \\cos, \\tan', description: 'Trigonometric' },
    { symbol: '\\log, \\ln', description: 'Logarithms' },
    { symbol: '\\pm, \\mp', description: 'Plus/minus' },
    { symbol: '\\leq, \\geq', description: 'Inequalities' },
    { symbol: '\\infty', description: 'Infinity' }
  ];

  const insertSymbol = (symbol: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + symbol + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + symbol.length, start + symbol.length);
      }, 0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center space-x-2 px-3 py-1 rounded text-sm ${
              showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
          >
            <BookOpen className="h-4 w-4" />
            <span>LaTeX Guide</span>
          </button>
        </div>
      </div>

      {/* Math Symbols Palette */}
      <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg">
        {mathSymbols.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => insertSymbol(item.symbol)}
            className="p-2 bg-white rounded border hover:bg-blue-50 text-sm font-mono"
            title={item.description}
          >
            {item.symbol}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LaTeX Input
          </label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Enter your question with LaTeX math: $x^2 + y^2 = z^2$"}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] font-mono text-sm"
          />
        </div>

        {showPreview && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[120px]"
              dangerouslySetInnerHTML={{ __html: renderLatex(value) }}
            />
          </div>
        )}
      </div>

      {/* LaTeX Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">LaTeX Math Guide</h3>
              <button
                onClick={() => setShowGuide(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Math */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Basic Math</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><code>{'x^2'}</code><span>Superscript: x²</span></div>
                  <div className="flex justify-between"><code>{'x_1'}</code><span>Subscript: x₁</span></div>
                  <div className="flex justify-between"><code>{'\\frac{a}{b}'}</code><span>Fraction: a/b</span></div>
                  <div className="flex justify-between"><code>{'\\sqrt{x}'}</code><span>Square root: √x</span></div>
                  <div className="flex justify-between"><code>{'\\sqrt[n]{x}'}</code><span>nth root: ⁿ√x</span></div>
                </div>
              </div>

              {/* Advanced Math */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Advanced Math</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><code>{'\\sum_{i=1}^{n}'}</code><span>Summation</span></div>
                  <div className="flex justify-between"><code>{'\\int_{a}^{b}'}</code><span>Integral</span></div>
                  <div className="flex justify-between"><code>{'\\lim_{x \\to 0}'}</code><span>Limit</span></div>
                  <div className="flex justify-between"><code>{'\\partial'}</code><span>Partial derivative</span></div>
                  <div className="flex justify-between"><code>{'\\infty'}</code><span>Infinity: ∞</span></div>
                </div>
              </div>

              {/* Greek Letters */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Greek Letters</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><code>{'\\alpha, \\beta, \\gamma'}</code><span>α, β, γ</span></div>
                  <div className="flex justify-between"><code>{'\\delta, \\epsilon, \\zeta'}</code><span>δ, ε, ζ</span></div>
                  <div className="flex justify-between"><code>{'\\theta, \\lambda, \\mu'}</code><span>θ, λ, μ</span></div>
                  <div className="flex justify-between"><code>{'\\pi, \\sigma, \\phi'}</code><span>π, σ, φ</span></div>
                  <div className="flex justify-between"><code>{'\\omega, \\Omega'}</code><span>ω, Ω</span></div>
                </div>
              </div>

              {/* Symbols */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Symbols</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><code>{'\\pm, \\mp'}</code><span>±, ∓</span></div>
                  <div className="flex justify-between"><code>{'\\leq, \\geq'}</code><span>≤, ≥</span></div>
                  <div className="flex justify-between"><code>{'\\neq, \\approx'}</code><span>≠, ≈</span></div>
                  <div className="flex justify-between"><code>{'\\times, \\div'}</code><span>×, ÷</span></div>
                  <div className="flex justify-between"><code>{'\\rightarrow, \\leftarrow'}</code><span>→, ←</span></div>
                </div>
              </div>
            </div>

            {/* Chemistry Examples */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Chemistry Examples</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div><code>{'H_2O'}</code> → H₂O</div>
                <div><code>{'CO_2'}</code> → CO₂</div>
                <div><code>{'Ca^{2+}'}</code> → Ca²⁺</div>
                <div><code>{'SO_4^{2-}'}</code> → SO₄²⁻</div>
                <div><code>{'\\rightarrow'}</code> for reaction arrows</div>
              </div>
            </div>

            {/* Physics Examples */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Physics Examples</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div><code>{'F = ma'}</code> → F = ma</div>
                <div><code>{'E = mc^2'}</code> → E = mc²</div>
                <div><code>{'v = \\frac{d}{t}'}</code> → v = d/t</div>
                <div><code>{'\\Delta x'}</code> → Δx</div>
                <div><code>{'\\omega = 2\\pi f'}</code> → ω = 2πf</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaTeXEditor;