import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTest } from '../contexts/TestContext';

const Timer: React.FC = () => {
  const { timeRemaining, setTimeRemaining } = useTest();

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, setTimeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-600'; // Last 5 minutes
    if (timeRemaining <= 600) return 'text-yellow-600'; // Last 10 minutes
    return 'text-green-600';
  };

  return (
    <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
      <Clock className="h-5 w-5" />
      <span className="font-mono text-lg font-semibold">
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
};

export default Timer;