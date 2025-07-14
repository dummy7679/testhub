import * as pdfjsLib from 'pdfjs-dist';
import { Question } from './supabase';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface ImportedQuestion {
  question: string;
  type: 'mcq' | 'short' | 'essay';
  options?: string[];
  correct_answer?: string;
  marks: number;
  subject: string;
  topic?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const pdfImporter = {
  async extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  },

  parseQuestionsFromText(text: string, defaultSubject: string = 'General'): ImportedQuestion[] {
    const questions: ImportedQuestion[] = [];
    
    // Split by question numbers (1., 2., Q1, Q2, etc.)
    const questionBlocks = text.split(/(?:\n|^)(?:\d+\.|\bQ\d+\.?|\bQuestion\s+\d+)/i);
    
    questionBlocks.forEach((block, index) => {
      if (index === 0 || !block.trim()) return; // Skip empty first block
      
      const lines = block.trim().split('\n').filter(line => line.trim());
      if (lines.length === 0) return;
      
      const questionText = lines[0].trim();
      if (!questionText) return;
      
      // Detect question type
      const hasOptions = lines.some(line => 
        /^[a-d]\)|^[A-D]\)|^\([a-d]\)|^\([A-D]\)/.test(line.trim())
      );
      
      let type: 'mcq' | 'short' | 'essay' = 'short';
      let options: string[] = [];
      let correctAnswer = '';
      
      if (hasOptions) {
        type = 'mcq';
        options = lines
          .filter(line => /^[a-dA-D]\)|^\([a-dA-D]\)/.test(line.trim()))
          .map(line => line.replace(/^[a-dA-D]\)|^\([a-dA-D]\)/, '').trim())
          .slice(0, 4);
        
        // Try to detect correct answer (marked with * or "Ans:" or "Answer:")
        const answerLine = lines.find(line => 
          /answer|ans|correct/i.test(line) || line.includes('*')
        );
        if (answerLine) {
          const match = answerLine.match(/[a-dA-D]/);
          if (match && options.length > 0) {
            const answerIndex = match[0].toLowerCase().charCodeAt(0) - 97;
            if (answerIndex >= 0 && answerIndex < options.length) {
              correctAnswer = options[answerIndex];
            }
          }
        }
      } else if (questionText.length > 200 || /explain|describe|discuss|elaborate/i.test(questionText)) {
        type = 'essay';
      }
      
      // Detect marks
      let marks = 1;
      const marksMatch = block.match(/\[(\d+)\s*marks?\]|\((\d+)\s*marks?\)|(\d+)\s*marks?/i);
      if (marksMatch) {
        marks = parseInt(marksMatch[1] || marksMatch[2] || marksMatch[3]) || 1;
      }
      
      // Detect difficulty
      let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
      if (/easy|basic|simple/i.test(block)) difficulty = 'Easy';
      if (/hard|difficult|complex|advanced/i.test(block)) difficulty = 'Hard';
      
      questions.push({
        question: questionText,
        type,
        options: type === 'mcq' ? options : undefined,
        correct_answer: correctAnswer || undefined,
        marks,
        subject: defaultSubject,
        difficulty
      });
    });
    
    return questions;
  },

  async importQuestionsFromPDF(
    file: File, 
    subject: string, 
    topic?: string
  ): Promise<ImportedQuestion[]> {
    try {
      const text = await this.extractTextFromPDF(file);
      const questions = this.parseQuestionsFromText(text, subject);
      
      // Add topic if provided
      return questions.map(q => ({
        ...q,
        topic: topic || q.topic
      }));
    } catch (error) {
      console.error('PDF import error:', error);
      throw new Error('Failed to import questions from PDF. Please check the file format.');
    }
  },

  // Template for manual question formatting
  getQuestionTemplate(): string {
    return `
Question Format Template:

1. What is the capital of India?
   a) Mumbai
   b) Delhi
   c) Kolkata
   d) Chennai
   Answer: b
   [2 marks]

2. Explain the process of photosynthesis.
   [5 marks]

3. Solve: 2x + 5 = 15
   [3 marks]

Guidelines:
- Number questions sequentially (1., 2., Q1, Q2, etc.)
- For MCQ: Use a), b), c), d) or (a), (b), (c), (d)
- Mark correct answer with "Answer:" or "Ans:" followed by option
- Specify marks with [X marks] or (X marks)
- Use keywords like "Easy", "Medium", "Hard" for difficulty
- Separate questions with blank lines
    `;
  }
};