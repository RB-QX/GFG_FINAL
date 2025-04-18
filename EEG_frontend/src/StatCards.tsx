// StatCards.tsx
import React from 'react';

interface StatCardsProps {
  total: number;
  confidencePercent: number;
  processingTime: number;
}

const StatCards: React.FC<StatCardsProps> = ({ total, confidencePercent, processingTime }) => {
  const format = (val: number, suffix = '') => (val === 0 ? '--' : `${val}${suffix}`);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 animate-fadeIn">
      <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow transform transition-transform hover:scale-105">
        🔍 Total Analyses<br />
        <strong>{format(total)}</strong>
      </div>
      <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow transform transition-transform hover:scale-105">
        ✅ Success Rate<br />
        <strong>100%</strong>
      </div>
      <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow transform transition-transform hover:scale-105">
        ⏱ Processing Time<br />
        <strong>{format(processingTime, 'ms')}</strong>
      </div>
      <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow transform transition-transform hover:scale-105">
        📊 Confidence<br />
        <strong>{format(confidencePercent, '%')}</strong>
      </div>
    </div>
  );
};

export default StatCards;