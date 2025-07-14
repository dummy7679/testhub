import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Test, Submission } from './supabase';

export interface ReportData {
  student: {
    name: string;
    class: string;
  };
  test: {
    title: string;
    subject: string;
    chapter?: string;
    totalMarks: number;
  };
  performance: {
    marksObtained: number;
    percentage: number;
    grade: string;
    rank: number;
    totalStudents: number;
  };
  questionWise: Array<{
    question: string;
    marksObtained: number;
    totalMarks: number;
    correct: boolean;
  }>;
  timeSpent: number;
  submittedAt: string;
}

export const reportGenerator = {
  calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  },

  calculateRank(submissions: Submission[], currentSubmission: Submission): number {
    const sortedSubmissions = submissions
      .map(sub => ({
        ...sub,
        finalScore: sub.manual_score || sub.auto_score
      }))
      .sort((a, b) => b.finalScore - a.finalScore);

    const currentFinalScore = currentSubmission.manual_score || currentSubmission.auto_score;
    return sortedSubmissions.findIndex(sub => sub.id === currentSubmission.id) + 1;
  },

  async generateIndividualReport(
    test: Test,
    submission: Submission,
    allSubmissions: Submission[]
  ): Promise<Blob> {
    const finalScore = submission.manual_score || submission.auto_score;
    const percentage = Math.round((finalScore / submission.total_marks) * 100);
    const grade = this.calculateGrade(percentage);
    const rank = this.calculateRank(allSubmissions, submission);

    const reportData: ReportData = {
      student: {
        name: submission.student_name,
        class: test.class
      },
      test: {
        title: test.title,
        subject: test.subject,
        chapter: test.chapter,
        totalMarks: submission.total_marks
      },
      performance: {
        marksObtained: finalScore,
        percentage,
        grade,
        rank,
        totalStudents: allSubmissions.length
      },
      questionWise: test.questions.map((q, index) => ({
        question: q.question,
        marksObtained: this.calculateQuestionScore(q, submission.answers[q.id] || ''),
        totalMarks: q.marks,
        correct: this.isAnswerCorrect(q, submission.answers[q.id] || '')
      })),
      timeSpent: submission.time_spent,
      submittedAt: submission.submitted_at
    };

    return this.createPDFReport(reportData);
  },

  async generateClassReport(
    test: Test,
    submissions: Submission[]
  ): Promise<Blob> {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('SOSE TestHub - Class Report', 20, 30);
    
    pdf.setFontSize(14);
    pdf.text(`Test: ${test.title}`, 20, 50);
    pdf.text(`Subject: ${test.subject}`, 20, 65);
    pdf.text(`Class: ${test.class}`, 20, 80);
    pdf.text(`Total Students: ${submissions.length}`, 20, 95);

    // Statistics
    const averageScore = submissions.reduce((sum, sub) => sum + (sub.manual_score || sub.auto_score), 0) / submissions.length;
    const averagePercentage = Math.round((averageScore / submissions[0]?.total_marks || 1) * 100);
    
    pdf.text(`Class Average: ${averageScore.toFixed(1)}/${submissions[0]?.total_marks || 0} (${averagePercentage}%)`, 20, 110);

    // Student list
    let yPosition = 130;
    pdf.setFontSize(12);
    pdf.text('Student Performance:', 20, yPosition);
    yPosition += 15;

    submissions
      .sort((a, b) => (b.manual_score || b.auto_score) - (a.manual_score || a.auto_score))
      .forEach((submission, index) => {
        const finalScore = submission.manual_score || submission.auto_score;
        const percentage = Math.round((finalScore / submission.total_marks) * 100);
        const grade = this.calculateGrade(percentage);
        
        pdf.text(
          `${index + 1}. ${submission.student_name}: ${finalScore}/${submission.total_marks} (${percentage}%) - ${grade}`,
          20,
          yPosition
        );
        yPosition += 10;

        // Add new page if needed
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
      });

    return pdf.output('blob');
  },

  async createPDFReport(reportData: ReportData): Promise<Blob> {
    const pdf = new jsPDF();
    
    // Header with logo area
    pdf.setFillColor(59, 130, 246); // Blue background
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('SOSE TestHub', 20, 25);
    
    pdf.setFontSize(14);
    pdf.text('Student Report Card', 20, 35);

    // Reset text color
    pdf.setTextColor(0, 0, 0);

    // Student Information
    pdf.setFontSize(16);
    pdf.text('Student Information', 20, 60);
    
    pdf.setFontSize(12);
    pdf.text(`Name: ${reportData.student.name}`, 20, 75);
    pdf.text(`Class: ${reportData.student.class}`, 20, 85);
    pdf.text(`Test: ${reportData.test.title}`, 20, 95);
    pdf.text(`Subject: ${reportData.test.subject}`, 20, 105);
    if (reportData.test.chapter) {
      pdf.text(`Chapter: ${reportData.test.chapter}`, 20, 115);
    }

    // Performance Summary
    pdf.setFontSize(16);
    pdf.text('Performance Summary', 20, 135);
    
    pdf.setFontSize(12);
    pdf.text(`Marks Obtained: ${reportData.performance.marksObtained}/${reportData.test.totalMarks}`, 20, 150);
    pdf.text(`Percentage: ${reportData.performance.percentage}%`, 20, 160);
    pdf.text(`Grade: ${reportData.performance.grade}`, 20, 170);
    pdf.text(`Rank: ${reportData.performance.rank}/${reportData.performance.totalStudents}`, 20, 180);

    // Question-wise Analysis
    pdf.setFontSize(16);
    pdf.text('Question-wise Performance', 20, 200);
    
    let yPos = 215;
    pdf.setFontSize(10);
    
    reportData.questionWise.forEach((q, index) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      const status = q.correct ? '✓' : '✗';
      const statusColor = q.correct ? [34, 197, 94] : [239, 68, 68];
      
      pdf.setTextColor(...statusColor);
      pdf.text(`${status}`, 20, yPos);
      
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Q${index + 1}: ${q.marksObtained}/${q.totalMarks}`, 30, yPos);
      
      // Truncate long questions
      const questionText = q.question.length > 60 ? q.question.substring(0, 60) + '...' : q.question;
      pdf.text(questionText, 30, yPos + 8);
      
      yPos += 20;
    });

    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 280);
    pdf.text(`Submitted on: ${new Date(reportData.submittedAt).toLocaleDateString()}`, 20, 290);

    return pdf.output('blob');
  },

  calculateQuestionScore(question: any, answer: string): number {
    if (question.type === 'mcq') {
      return answer === question.correct_answer ? question.marks : 0;
    }
    // For subjective questions, return full marks for now (should be manually graded)
    return answer.trim() ? question.marks : 0;
  },

  isAnswerCorrect(question: any, answer: string): boolean {
    if (question.type === 'mcq') {
      return answer === question.correct_answer;
    }
    // For subjective questions, consider answered as correct for now
    return answer.trim().length > 0;
  },

  downloadReport(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};