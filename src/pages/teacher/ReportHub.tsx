import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Mail, Eye, User, Calendar } from 'lucide-react';
import SOSELogo from '../../components/SOSELogo';

const ReportHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reportType, setReportType] = useState('individual');
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);

  const mockTests = [
    { code: 'TEST123', title: 'Mathematics Mid-Term Exam' },
    { code: 'SCI456', title: 'Science Chapter 5 Quiz' },
    { code: 'ENG789', title: 'English Literature Assessment' }
  ];

  const mockStudents = [
    { id: 1, name: 'Ananya Gupta', class: '10th A' },
    { id: 2, name: 'Arjun Mehta', class: '10th A' },
    { id: 3, name: 'Kavya Sharma', class: '10th A' },
    { id: 4, name: 'Rohit Patel', class: '10th B' },
    { id: 5, name: 'Sneha Joshi', class: '10th A' }
  ];

  const mockReports = [
    {
      id: 1,
      type: 'individual',
      studentName: 'Ananya Gupta',
      testTitle: 'Mathematics Mid-Term Exam',
      generatedAt: '2025-01-15T14:30:00Z',
      pdfUrl: '/reports/ananya_math_report.pdf',
      status: 'generated'
    },
    {
      id: 2,
      type: 'class',
      testTitle: 'Science Chapter 5 Quiz',
      generatedAt: '2025-01-15T15:00:00Z',
      pdfUrl: '/reports/class_science_report.pdf',
      status: 'generated'
    },
    {
      id: 3,
      type: 'individual',
      studentName: 'Arjun Mehta',
      testTitle: 'English Literature Assessment',
      generatedAt: '2025-01-15T15:30:00Z',
      pdfUrl: '/reports/arjun_english_report.pdf',
      status: 'generated'
    }
  ];

  const handleGenerateReport = () => {
    if (!selectedTest) {
      alert('Please select a test');
      return;
    }

    if (reportType === 'individual' && !selectedStudent) {
      alert('Please select a student');
      return;
    }

    const newReport = {
      id: Date.now(),
      type: reportType,
      studentName: reportType === 'individual' ? mockStudents.find(s => s.id.toString() === selectedStudent)?.name : null,
      testTitle: mockTests.find(t => t.code === selectedTest)?.title,
      generatedAt: new Date().toISOString(),
      pdfUrl: `/reports/report_${Date.now()}.pdf`,
      status: 'generating'
    };

    setGeneratedReports([newReport, ...generatedReports]);

    // Simulate report generation
    setTimeout(() => {
      setGeneratedReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { ...report, status: 'generated' }
          : report
      ));
    }, 2000);
  };

  const handleDownloadReport = (report: any) => {
    // Mock download
    alert(`Downloading ${report.type} report for ${report.studentName || 'class'}...`);
  };

  const handleEmailReport = (report: any) => {
    // Mock email
    alert(`Email sent for ${report.type} report for ${report.studentName || 'class'}...`);
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
                <h1 className="text-xl font-bold text-gray-900">Report Card Hub</h1>
                <p className="text-sm text-gray-600">Generate and manage student report cards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Report Generator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New Report</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="individual">Individual Student</option>
                    <option value="class">Class Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Test
                  </label>
                  <select
                    value={selectedTest}
                    onChange={(e) => setSelectedTest(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a test...</option>
                    {mockTests.map(test => (
                      <option key={test.code} value={test.code}>
                        {test.title}
                      </option>
                    ))}
                  </select>
                </div>

                {reportType === 'individual' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Student
                    </label>
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose a student...</option>
                      {mockStudents.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} - {student.class}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={handleGenerateReport}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Generated Reports */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Generated Reports</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {[...generatedReports, ...mockReports].map((report) => (
                  <div key={report.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {report.type === 'individual' ? 'Individual Report' : 'Class Report'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {report.studentName && (
                              <span className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{report.studentName}</span>
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">{report.testTitle}</p>
                          <p className="text-xs text-gray-400 flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'generated' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status === 'generated' ? 'Ready' : 'Generating...'}
                        </span>
                        
                        {report.status === 'generated' && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleDownloadReport(report)}
                              className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEmailReport(report)}
                              className="p-2 text-green-600 hover:text-green-800 transition-colors"
                              title="Send Email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Report Template Preview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Card Template</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                <SOSELogo />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">STUDENT REPORT CARD</h3>
              <p className="text-gray-600 mb-6">Academic Performance Report</p>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <p><strong>Student Name:</strong> [Student Name]</p>
                  <p><strong>Class:</strong> [Class]</p>
                  <p><strong>Test:</strong> [Test Name]</p>
                  <p><strong>Subject:</strong> [Subject]</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Marks Obtained:</strong> [Marks] / [Total]</p>
                  <p><strong>Percentage:</strong> [Percentage]%</p>
                  <p><strong>Grade:</strong> [Grade]</p>
                  <p><strong>Percentile:</strong> [Percentile]</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Teacher's Remarks:</strong> [Customized feedback based on performance]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHub;