import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Award, Download } from 'lucide-react';
import SOSELogo from '../../components/SOSELogo';

const Rankings: React.FC = () => {
  const navigate = useNavigate();
  const { testCode } = useParams<{ testCode: string }>();
  const [rankings, setRankings] = useState<any[]>([]);
  const [filterClass, setFilterClass] = useState('all');

  useEffect(() => {
    // Mock rankings data
    const mockRankings = [
      { rank: 1, name: 'Ananya Gupta', class: '10th A', score: 95, totalMarks: 100, percentage: 95, timeTaken: 42 },
      { rank: 2, name: 'Arjun Mehta', class: '10th A', score: 92, totalMarks: 100, percentage: 92, timeTaken: 45 },
      { rank: 3, name: 'Kavya Sharma', class: '10th A', score: 88, totalMarks: 100, percentage: 88, timeTaken: 38 },
      { rank: 4, name: 'Rohit Patel', class: '10th B', score: 85, totalMarks: 100, percentage: 85, timeTaken: 47 },
      { rank: 5, name: 'Sneha Joshi', class: '10th A', score: 82, totalMarks: 100, percentage: 82, timeTaken: 52 },
      { rank: 6, name: 'Vikram Singh', class: '10th B', score: 78, totalMarks: 100, percentage: 78, timeTaken: 55 },
      { rank: 7, name: 'Pooja Reddy', class: '10th A', score: 75, totalMarks: 100, percentage: 75, timeTaken: 49 },
      { rank: 8, name: 'Karan Verma', class: '10th B', score: 72, totalMarks: 100, percentage: 72, timeTaken: 58 },
      { rank: 9, name: 'Isha Agarwal', class: '10th A', score: 68, totalMarks: 100, percentage: 68, timeTaken: 44 },
      { rank: 10, name: 'Aditya Kumar', class: '10th B', score: 65, totalMarks: 100, percentage: 65, timeTaken: 51 }
    ];
    setRankings(mockRankings);
  }, [testCode]);

  const filteredRankings = filterClass === 'all' 
    ? rankings 
    : rankings.filter(student => student.class === filterClass);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = ['bg-yellow-100 text-yellow-800', 'bg-gray-100 text-gray-800', 'bg-orange-100 text-orange-800'];
      return colors[rank - 1];
    }
    return 'bg-blue-100 text-blue-800';
  };

  const exportRankings = () => {
    const csvContent = [
      ['Rank', 'Name', 'Class', 'Score', 'Total Marks', 'Percentage', 'Time Taken (min)'],
      ...filteredRankings.map(student => [
        student.rank,
        student.name,
        student.class,
        student.score,
        student.totalMarks,
        student.percentage,
        student.timeTaken
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rankings_${testCode}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/teacher/tests')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Tests</span>
              </button>
              <SOSELogo />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Rankings</h1>
                <p className="text-sm text-gray-600">Student performance leaderboard</p>
              </div>
            </div>
            
            <button
              onClick={exportRankings}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{rankings.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Score</p>
                <p className="text-2xl font-bold text-gray-900">{rankings[0]?.score || 0}%</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(rankings.reduce((sum, student) => sum + student.score, 0) / rankings.length) || 0}%
                </p>
              </div>
              <Medal className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Class:</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Classes</option>
              <option value="10th A">10th A</option>
              <option value="10th B">10th B</option>
            </select>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Performers</h2>
          <div className="flex justify-center items-end space-x-8">
            {filteredRankings.slice(0, 3).map((student, index) => (
              <div key={student.rank} className="text-center">
                <div className={`p-4 rounded-lg ${
                  index === 0 ? 'bg-yellow-50 border-2 border-yellow-200' :
                  index === 1 ? 'bg-gray-50 border-2 border-gray-200' :
                  'bg-orange-50 border-2 border-orange-200'
                }`}>
                  {getRankIcon(student.rank)}
                  <div className="mt-2">
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.class}</p>
                    <p className="text-lg font-bold text-gray-900">{student.score}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Rankings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Complete Rankings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Taken
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRankings.map((student, index) => (
                  <tr key={student.rank} className={`hover:bg-gray-50 ${index < 3 ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRankIcon(student.rank)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRankBadge(student.rank)}`}>
                          #{student.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.score} / {student.totalMarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${student.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{student.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.timeTaken} min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rankings;