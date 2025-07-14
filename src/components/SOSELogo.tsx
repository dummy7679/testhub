import React from 'react';
import { GraduationCap } from 'lucide-react';

const SOSELogo: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="bg-blue-600 p-3 rounded-full">
        <GraduationCap className="h-8 w-8 text-white" />
      </div>
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900">SOSE</h1>
        <p className="text-sm text-gray-600">TestHub</p>
      </div>
    </div>
  );
};

export default SOSELogo;